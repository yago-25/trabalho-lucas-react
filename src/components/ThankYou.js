import { Box, Container, Heading, Text, Button, VStack, Icon } from "@chakra-ui/react";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50" py={20}>
      <Container maxW="container.md">
        <VStack spacing={8} bg="white" p={8} borderRadius="lg" boxShadow="xl">
          <Icon as={FiCheckCircle} w={20} h={20} color="green.500" />
          <Heading textAlign="center" size="xl">
            Pedido Realizado com Sucesso!
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.600">
            Agradecemos pela sua compra. Seu pedido foi confirmado e está sendo processado.
          </Text>
          <Button
            leftIcon={<FiShoppingBag />}
            colorScheme="blue"
            size="lg"
            onClick={() => navigate("/store")}
          >
            Voltar para a Loja
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default ThankYou; 