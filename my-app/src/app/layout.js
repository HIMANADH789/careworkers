import AuthProvider from '../providers/AuthProvider';
import ApolloWrapper from "../components/ApolloWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <AuthProvider>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
          
        </AuthProvider>
      </body>
    </html>
  );
}
