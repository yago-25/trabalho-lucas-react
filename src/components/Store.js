/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  SimpleGrid,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  Badge,
  useToast,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  List,
  ListItem,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
  ModalFooter,
  ButtonGroup,
} from "@chakra-ui/react";
import { FiShoppingCart, FiTrash2, FiSettings } from "react-icons/fi";
import { api } from "../services/api";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
    >
      <Image
        src={product.imagem || "https://via.placeholder.com/300"}
        alt={product.nome}
        w="100%"
        h="200px"
        objectFit="cover"
      />
      <VStack p={4} align="stretch" spacing={3}>
        <Heading size="md" noOfLines={1}>
          {product.nome}
        </Heading>
        <Text color="gray.600" noOfLines={2}>
          {product.descricao}
        </Text>
        <HStack justify="space-between">
          <Badge colorScheme="green" fontSize="lg" px={2} py={1}>
            R$ {product.preco.toFixed(2)}
          </Badge>
          <Text color="gray.500">{product.quantidade} disponíveis</Text>
        </HStack>
        <Button
          colorScheme="blue"
          leftIcon={<FiShoppingCart />}
          onClick={() => onAddToCart(product)}
          isDisabled={product.quantidade === 0}
        >
          Adicionar ao Carrinho
        </Button>
      </VStack>
    </Box>
  );
};

const CartItem = ({ item, onRemove }) => (
  <ListItem p={4} bg="white" borderRadius="md" boxShadow="sm" mb={2}>
    <HStack justify="space-between">
      <VStack align="start" flex={1}>
        <Heading size="sm">{item.nome}</Heading>
        <Text>R$ {item.preco.toFixed(2)}</Text>
        <Text color="gray.500">Quantidade: {item.cartQuantity}</Text>
      </VStack>
      <IconButton
        icon={<FiTrash2 />}
        colorScheme="red"
        variant="ghost"
        onClick={() => onRemove(item)}
        aria-label="Remover do carrinho"
      />
    </HStack>
  </ListItem>
);

const CheckoutModal = ({ isOpen, onClose, cart, total, onConfirmOrder }) => {
  const [buyerName, setBuyerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!buyerName || !paymentMethod) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    await onConfirmOrder({ buyerName, paymentMethod });
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Finalizar Compra</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Box w="100%">
              <Heading size="sm" mb={4}>
                Informações do Comprador
              </Heading>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Digite seu nome completo"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Método de Pagamento</FormLabel>
                <Select
                  placeholder="Selecione o método de pagamento"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="money">Dinheiro</option>
                </Select>
              </FormControl>
            </Box>

            <Divider />

            <Box w="100%">
              <Heading size="sm" mb={4}>
                Resumo do Pedido
              </Heading>
              <VStack align="stretch" spacing={3}>
                {cart.map((item) => (
                  <HStack key={item._id} justify="space-between">
                    <Text>
                      {item.nome} x {item.cartQuantity}
                    </Text>
                    <Text fontWeight="bold">
                      R$ {(item.preco * item.cartQuantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
                <Divider />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    Total
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.500">
                    R$ {total.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            isDisabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Processando"
          >
            Confirmar Pedido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Store = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const {
    isOpen: isCheckoutOpen,
    onOpen: onCheckoutOpen,
    onClose: onCheckoutClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/app/produtos/010623008");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item._id === product._id);

      if (existingItem) {
        if (existingItem.cartQuantity < product.quantidade) {
          return currentCart.map((item) =>
            item._id === product._id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          );
        } else {
          toast({
            title: "Quantidade máxima atingida",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
          return currentCart;
        }
      }

      toast({
        title: "Produto adicionado ao carrinho!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return [...currentCart, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== product._id)
    );
    toast({
      title: "Produto removido do carrinho",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.preco * item.cartQuantity,
      0
    );
  };

  const handleConfirmOrder = async (orderDetails) => {
    try {
      const orderData = {
        nomeCliente: orderDetails.buyerName,
        usuario: "010623008",
        data: new Date().toISOString().split("T")[0],
        produtos: cart.map((item) => ({
          nome: item.nome,
          quantidade: item.cartQuantity,
          preco: item.preco,
        })),
      };

      await api.post("/app/venda", orderData);

      setCart([]);
      onCheckoutClose();
      onCartClose();

      navigate("/thank-you");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      toast({
        title: "Erro ao finalizar compra",
        description: "Por favor, tente novamente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" boxShadow="sm" px={4} py={4} mb={8}>
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg">Loja Virtual</Heading>
            <ButtonGroup spacing={4}>
              <Button
                leftIcon={<FiSettings />}
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate("/admin")}
              >
                Área Administrativa
              </Button>
              <Button
                leftIcon={<FiShoppingCart />}
                colorScheme="blue"
                onClick={onCartOpen}
              >
                Carrinho ({cart.length})
              </Button>
            </ButtonGroup>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </SimpleGrid>
      </Container>

      <Drawer
        isOpen={isCartOpen}
        placement="right"
        onClose={onCartClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Seu Carrinho</DrawerHeader>
          <DrawerBody>
            {cart.length === 0 ? (
              <Text color="gray.500">Seu carrinho está vazio</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                <List spacing={3}>
                  {cart.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onRemove={removeFromCart}
                    />
                  ))}
                </List>
                <Box pt={6} borderTopWidth={1}>
                  <Heading size="md" mb={4}>
                    Total: R$ {calculateTotal().toFixed(2)}
                  </Heading>
                  <Button
                    colorScheme="green"
                    size="lg"
                    width="full"
                    onClick={onCheckoutOpen}
                  >
                    Finalizar Compra
                  </Button>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={onCheckoutClose}
        cart={cart}
        total={calculateTotal()}
        onConfirmOrder={handleConfirmOrder}
      />
    </Box>
  );
};

export default Store;
