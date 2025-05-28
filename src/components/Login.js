import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Container,
  FormControl,
  createStandaloneToast,
} from "@chakra-ui/react";
import { api } from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = createStandaloneToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Erro ao fazer login.",
        description: "Por favor, preencha todos os campos",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      if (username && password) {
        const response = await api.post("/app/login", {
          usuario: username,
          senha: password,
        });

        if (response.data.token) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", username);
          toast({
            title: "Login realizado com sucesso!",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          navigate("/admin");
        }
      }
    } catch (e) {
      toast({
        title: "Erro ao fazer login.",
        description: "Por favor, tente novamente",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      console.log("Erro ao fazer login: ", e);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center" mb={6}>
            Login
          </Heading>
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Usuário</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" mt={4}>
                Entrar
              </Button>
            </VStack>
          </form>
          <Text textAlign="center" mt={4}>
            Não tem uma conta?{" "}
            <Link as={RouterLink} to="/register" color="blue.500">
              Registre-se
            </Link>
          </Text>
          <Text textAlign="center">
            <Link as={RouterLink} to="/store" color="blue.500">
              Ir para a loja
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
