// Aquí se insertará el contenido completo de AuthForm (por brevedad omitido en este bloque)import React, { useState, useEffect } from 'react';
import {
  Box, Button, Input, Text, VStack, HStack, Divider, Textarea
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/users';

export default function AuthForm() {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [bulkText, setBulkText] = useState('');

  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}?email=${email}&password=${password}`);
    const data = await res.json();
    if (data.length > 0) {
      setUser(data[0]);
      setIsAdmin(email === 'administrador' && password === '0000');
    } else {
      alert('Credenciales inválidas');
    }
  };

  const handleRegister = async () => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, age })
    });
    if (res.ok) {
      alert('Registrado correctamente');
      setMode('login');
    }
  };

  const updateUser = async (updatedUser) => {
    const res = await fetch(`${API_URL}/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });
    if (res.ok) {
      alert('Datos actualizados');
      if (!isAdmin) setUser(updatedUser);
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      if (user.id === id) setUser(null);
      alert('Usuario eliminado');
      fetchUsers();
    }
  };

  const handleBulkUpload = async () => {
    const lines = bulkText.split('\n').filter(Boolean);
    for (let line of lines) {
      const [name, age, email, password] = line.split(',');
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, email, password })
      });
    }
    alert('Datos agregados');
    setBulkText('');
    fetchUsers();
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setEmail('');
    setPassword('');
    setName('');
    setAge('');
  };

  if (user) {
    return (
      <Box p={6}>
        <HStack justify="space-between">
          <Text fontSize="xl">Bienvenido, {user.name}</Text>
          <Button onClick={logout} colorScheme="red">Cerrar sesión</Button>
        </HStack>

        {isAdmin ? (
          <Box mt={6}>
            <Text fontWeight="bold" mb={2}>Lista de usuarios (admin):</Text>
            {users.map((u) => (
              <Box key={u.id} p={3} border="1px solid #ccc" mb={2} borderRadius="md">
                <VStack align="stretch">
                  <Input value={u.name} onChange={e => u.name = e.target.value} placeholder="Nombre" />
                  <Input value={u.age} onChange={e => u.age = e.target.value} placeholder="Edad" />
                  <Input value={u.email} onChange={e => u.email = e.target.value} placeholder="Email" />
                  <Input value={u.password} onChange={e => u.password = e.target.value} placeholder="Contraseña" />
                  <HStack>
                    <Button onClick={() => updateUser(u)} colorScheme="green">Guardar</Button>
                    <Button onClick={() => deleteUser(u.id)} colorScheme="red">Eliminar</Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </Box>
        ) : (
          <Box mt={6}>
            <Text fontWeight="bold" mb={2}>Editar tus datos:</Text>
            <VStack spacing={3}>
              <Input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} placeholder="Nombre" />
              <Input value={user.age} onChange={e => setUser({ ...user, age: e.target.value })} placeholder="Edad" />
              <Input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="Email" />
              <Input value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} placeholder="Contraseña" />
              <HStack>
                <Button onClick={() => updateUser(user)} colorScheme="green">Guardar</Button>
                <Button onClick={deleteUser} disabled={isAdmin}title={isAdmin ? "El administrador no puede eliminar su cuenta" : ""}>Eliminar</Button>
                {!isAdmin && (
              <button onClick={deleteUser}>Eliminar</button>
            )}

              </HStack>
            </VStack>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <Text fontSize="2xl" mb={4}>{mode === 'login' ? 'Iniciar Sesión' : 'Registro'}</Text>
      <VStack spacing={3}>
        {mode === 'register' && (
          <>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
            <Input value={age} onChange={e => setAge(e.target.value)} placeholder="Edad" />
          </>
        )}
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <Button onClick={mode === 'login' ? handleLogin : handleRegister} colorScheme="blue">
          {mode === 'login' ? 'Entrar' : 'Registrar'}
        </Button>
        <Button variant="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </Button>
      </VStack>

      <Divider my={6} />
      <Text fontWeight="bold" mb={2}>Agregar datos (lista en formato CSV):</Text>
      <Textarea
        placeholder="nombre,edad,email,password"
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
      />
      <Button onClick={handleBulkUpload} mt={2} colorScheme="teal">Cargar Lista</Button>
    </Box>
  );
}
