import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Container,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiPackage, FiGrid, FiDollarSign, FiLogOut } from "react-icons/fi";

const AdminCard = ({ title, description, icon, onClick }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        bg: hoverBg,
      }}
      onClick={onClick}
    >
      <VStack spacing={4}>
        <Icon as={icon} w={10} h={10} color="blue.500" />
        <Heading size="md" textAlign="center">
          {title}
        </Heading>
        <Text textAlign="center" color="gray.600">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" boxShadow="sm" px={4} py={4}>
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg">Painel Administrativo</Heading>
            <Flex alignItems="center" gap={4}>
              <Text>Olá, {username}</Text>
              <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="ghost"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <AdminCard
            title="Produtos"
            description="Gerencie seu catálogo de produtos"
            icon={FiPackage}
            onClick={() => navigate("/admin/produtos")}
          />
          <AdminCard
            title="Categorias"
            description="Organize suas categorias de produtos"
            icon={FiGrid}
            onClick={() => navigate("/admin/categorias")}
          />
          <AdminCard
            title="Vendas"
            description="Acompanhe o histórico de vendas"
            icon={FiDollarSign}
            onClick={() => navigate("/admin/vendas")}
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Admin;
