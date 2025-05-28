import React from "react";
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logout realizado com sucesso!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Box
      bg={bgColor}
      px={4}
      position="fixed"
      w="100%"
      top={0}
      zIndex={1000}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={8} alignItems="center">
          <Button
            as={Link}
            to="/admin/produtos"
            variant="ghost"
            colorScheme="blue"
          >
            Produtos
          </Button>
          <Button
            as={Link}
            to="/admin/categorias"
            variant="ghost"
            colorScheme="blue"
          >
            Categorias
          </Button>
          <Button
            as={Link}
            to="/admin/vendas"
            variant="ghost"
            colorScheme="blue"
          >
            Vendas
          </Button>
        </Stack>

        <Button colorScheme="red" variant="ghost" onClick={handleLogout}>
          Sair
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
