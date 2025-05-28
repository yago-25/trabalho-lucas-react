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
  useToast,
  Flex,
  Heading,
  IconButton,
  Box,
  useColorModeValue,
  Text,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "../services/api";
import Header from "./Header";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nome_categoria: "",
  });

  const toast = useToast();
  const usuario = localStorage.getItem("user");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/app/categorias");
      setCategories(response.data);
    } catch (error) {
      showToast("Erro ao carregar categorias", "error");
    }
  };

  const handleOpen = (category = null) => {
    if (category) {
      setFormData({
        id: category._id,
        nome_categoria: category.nome,
      });
      setEditMode(true);
    } else {
      setFormData({
        id: "",
        nome_categoria: "",
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
        await api.put("/app/categorias", formData);
        showToast("Categoria atualizada com sucesso!");
      } else {
        await api.post("/app/categorias", { ...formData, usuario });
        showToast("Categoria criada com sucesso!");
      }
      handleClose();
      fetchCategories();
    } catch (error) {
      showToast(
        `Erro ao ${editMode ? "atualizar" : "criar"} categoria`,
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete("/app/categorias", { data: { id } });
        showToast("Categoria excluída com sucesso!");
        fetchCategories();
      } catch (error) {
        showToast("Erro ao excluir categoria", "error");
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
                Categorias
              </Heading>
              <Text color="gray.600">
                Gerencie as categorias dos seus produtos
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
              Nova Categoria
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
                  <Th>Nome</Th>
                  <Th>ID</Th>
                  <Th textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((category) => (
                  <Tr key={category._id}>
                    <Td>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {category.nome}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.500">
                        {category._id}
                      </Text>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        mr={2}
                        onClick={() => handleOpen(category)}
                        aria-label="Editar categoria"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(category._id)}
                        aria-label="Excluir categoria"
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
            {editMode ? "Editar Categoria" : "Nova Categoria"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <Input
                placeholder="Nome da categoria"
                value={formData.nome_categoria}
                onChange={(e) =>
                  setFormData({ ...formData, nome_categoria: e.target.value })
                }
                size="lg"
                required
              />
            </ModalBody>
            <ModalFooter bg={useColorModeValue("gray.50", "gray.700")} borderTopWidth="1px">
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

export default Categories; 