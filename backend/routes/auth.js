require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const fetch = require('node-fetch');


const jwksClient = jwksRsa({
  jwksUri: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}


async function getAuth0UserProfile(auth0Id) {
  try {
    const tokenRes = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_MGMT_CLIENT_ID,
        client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Failed to get management API token');

    const userRes = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Id)}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );

    const userData = await userRes.json();
    return userData;
  } catch (err) {
    console.error('❌ Failed to fetch user profile from Auth0:', err.message);
    return null;
  }
}

async function authenticateUser(req, prisma) {
  let prismaUserId = null;

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return null;


    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ['RS256'],
          issuer: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/`,
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
        (err, decodedToken) => {
          if (err) return reject(err);
          resolve(decodedToken);
        }
      );
    });

    const auth0Id = decoded.sub;

   
    const namespace = 'https://yourdomain.com/';
    const roles = decoded[namespace + 'roles'] || [];
    let role = (roles.length > 0 ? roles[0] : 'CAREWORKER').trim().toUpperCase();

    const allowedRoles = ['MANAGER', 'CAREWORKER'];
    if (!allowedRoles.includes(role)) {
      console.warn(`⚠️ Role "${role}" not in enum, defaulting to CAREWORKER`);
      role = 'CAREWORKER';
    }

    
    let email = decoded.email || null;
    let name = decoded.name || decoded.nickname || (email ? email.split('@')[0] : 'Unknown');

    
    if (!email) {
      console.warn(`⚠️ Email missing in token for ${auth0Id}, fetching from Auth0...`);
      const profile = await getAuth0UserProfile(auth0Id);
      if (profile?.email) {
        email = profile.email;
        name = profile.name || profile.nickname || email.split('@')[0];
      }
    }


    if (!email) {
      console.error('❌ Could not retrieve email from token or Auth0 — aborting.');
      return null;
    }

    let user = await prisma.user.findUnique({ where: { auth0Id } });
    if (!user) {
      user = await prisma.user.create({
        data: { auth0Id, email, name, role },
      });
      console.log(`✅ Created new user with id: ${user.id}, role: ${role}`);
    }

    prismaUserId = user.id;
  } catch (err) {
    console.warn('❌ Auth verification failed:', err.message);
  }

  return prismaUserId;
}

module.exports = { authenticateUser };
