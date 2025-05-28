import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Container,
} from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import { api } from "../services/api";

const { toast } = createStandaloneToast();

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      toast({
        title: "Erro no registro",
        description: "Por favor, preencha todos os campos",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Erro no registro",
        description: "As senhas não coincidem",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await api.post("/app/registrar", {
        usuario: username,
        senha: password,
        confirma: confirmPassword,
      });

      if (response.data.id) {
        toast({
          title: "Conta criada com sucesso!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        navigate("/login");
      }
    } catch (e) {
      toast({
        title: "Erro no registro",
        description: "Por favor, tente novamente.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      console.log("Erro ao fazer registro: ", e);
    }
    navigate("/login");
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center" mb={6}>
            Registro
          </Heading>
          <form onSubmit={handleRegister}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Usuário</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escolha seu usuário"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Escolha sua senha"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirmar Senha</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" mt={4}>
                Registrar
              </Button>
            </VStack>
          </form>
          <Text textAlign="center" mt={4}>
            Já tem uma conta?{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Faça login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
