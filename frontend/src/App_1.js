import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AuthForm from './componentes/AuthForm';

function App() {
  return (
    <ChakraProvider>
      <AuthForm />
    </ChakraProvider>
  );
}

export default App;
