/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
  Flex,
  Heading,
  IconButton,
  Box,
  Image,
  useColorModeValue,
  Text,
  Badge,
  Select,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "../services/api";
import Header from "./Header";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    quantidade: 0,
    preco: 0,
    categoria: "",
    descricao: "",
    imagem: "",
  });

  const toast = useToast();
  const usuario = localStorage.getItem("user");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/app/produtos/${usuario}`);
      setProducts(response.data);
    } catch (error) {
      showToast("Erro ao carregar produtos", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/app/categorias");
      setCategories(response.data);
    } catch (error) {
      showToast("Erro ao carregar categorias", "error");
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setFormData(product);
      setEditMode(true);
    } else {
      setFormData({
        id: "",
        nome: "",
        quantidade: 0,
        preco: 0,
        categoria: "",
        descricao: "",
        imagem: "",
      });
      setEditMode(false);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditMode(false);
  };

  const showToast = (message, status = "success") => {
    toast({
      title: message,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put("/app/produtos", formData);
        showToast("Produto atualizado com sucesso!");
      } else {
        await api.post("/app/produtos", { ...formData, usuario });
        showToast("Produto criado com sucesso!");
      }
      handleClose();
      fetchProducts();
    } catch (error) {
      showToast(`Erro ao ${editMode ? "atualizar" : "criar"} produto`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete("/app/produtos", { data: { id } });
        showToast("Produto excluído com sucesso!");
        fetchProducts();
      } catch (error) {
        showToast("Erro ao excluir produto", "error");
      }
    }
  };

  return (
    <>
      <Header />
      <Box pt="72px" minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="container.xl" py={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg" mb={2}>
                Produtos
              </Heading>
              <Text color="gray.600">
                Gerencie seus produtos, estoque e preços
              </Text>
            </Box>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="lg"
              onClick={() => handleOpen()}
              shadow="sm"
              _hover={{ shadow: "md" }}
            >
              Novo Produto
            </Button>
          </Flex>

          <Box
            bg={bgColor}
            shadow="sm"
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                <Tr>
                  <Th>Imagem</Th>
                  <Th>Nome</Th>
                  <Th>Categoria</Th>
                  <Th isNumeric>Quantidade</Th>
                  <Th isNumeric>Preço</Th>
                  <Th textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product._id}>
                    <Td>
                      <Image
                        src={product.imagem}
                        alt={product.nome}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/50"
                      />
                    </Td>
                    <Td>
                      <Text fontWeight="medium">{product.nome}</Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {product.descricao}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {product.categoria}
                      </Badge>
                    </Td>
                    <Td isNumeric>
                      <Badge
                        colorScheme={product.quantidade > 0 ? "green" : "red"}
                        borderRadius="full"
                        px={2}
                      >
                        {product.quantidade}
                      </Badge>
                    </Td>
                    <Td isNumeric fontWeight="medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.preco)}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        mr={2}
                        onClick={() =>
                          handleOpen({ ...product, id: product._id })
                        }
                        aria-label="Editar produto"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(product._id)}
                        aria-label="Excluir produto"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>
            {editMode ? "Editar Produto" : "Novo Produto"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <Flex direction="column" gap={4}>
                <Input
                  placeholder="Nome do produto"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  size="lg"
                  required
                />
                <Select
                  placeholder="Selecione uma categoria"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  size="lg"
                  required
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.nome}>
                      {category.nome}
                    </option>
                  ))}
                </Select>
                <NumberInput
                  value={formData.quantidade}
                  onChange={(value) =>
                    setFormData({ ...formData, quantidade: Number(value) })
                  }
                  min={0}
                  size="lg"
                >
                  <NumberInputField placeholder="Quantidade" required />
                </NumberInput>
                <NumberInput
                  value={formData.preco}
                  onChange={(value) =>
                    setFormData({ ...formData, preco: Number(value) })
                  }
                  precision={2}
                  min={0}
                  size="lg"
                >
                  <NumberInputField placeholder="Preço" required />
                </NumberInput>
                <Textarea
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  size="lg"
                  required
                />
                <Input
                  placeholder="URL da imagem"
                  value={formData.imagem}
                  onChange={(e) =>
                    setFormData({ ...formData, imagem: e.target.value })
                  }
                  size="lg"
                  required
                />
              </Flex>
            </ModalBody>
            <ModalFooter
              bg={useColorModeValue("gray.50", "gray.700")}
              borderTopWidth="1px"
            >
              <Button onClick={handleClose} mr={3}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                size="lg"
                shadow="sm"
                _hover={{ shadow: "md" }}
              >
                {editMode ? "Atualizar" : "Criar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Products;
