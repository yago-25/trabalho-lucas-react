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
  useToast,
  Flex,
  Heading,
  IconButton,
  Box,
  useColorModeValue,
  Text,
  Badge,
  Stack,
  Collapse,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { api } from "../services/api";
import Header from "./Header";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [expandedSale, setExpandedSale] = useState(null);

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBgColor = useColorModeValue("gray.50", "gray.700");
  const expandedBgColor = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/app/venda");
      setSales(response.data);
    } catch (error) {
      showToast("Erro ao carregar vendas", "error");
    }
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

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await api.delete("/app/venda", { data: { id } });
        showToast("Venda excluída com sucesso!");
        fetchSales();
      } catch (error) {
        showToast("Erro ao excluir venda", "error");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const calculateTotal = (products) => {
    return products.reduce((total, product) => {
      return total + product.quantidade * product.preco;
    }, 0);
  };

  const toggleExpand = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <>
      <Header />
      <Box pt="72px" minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="container.xl" py={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg" mb={2}>
                Vendas
              </Heading>
              <Text color="gray.600">
                Visualize e gerencie o histórico de vendas
              </Text>
            </Box>
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
              <Thead bg={headerBgColor}>
                <Tr>
                  <Th></Th>
                  <Th>Cliente</Th>
                  <Th>Data</Th>
                  <Th>Total</Th>
                  <Th>Itens</Th>
                  <Th textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sales.map((sale) => (
                  <React.Fragment key={sale._id}>
                    <Tr>
                      <Td width="40px">
                        <IconButton
                          icon={
                            expandedSale === sale._id ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )
                          }
                          variant="ghost"
                          onClick={() => toggleExpand(sale._id)}
                          aria-label="Expandir detalhes"
                        />
                      </Td>
                      <Td>
                        <Text fontWeight="medium">{sale.nomeCliente}</Text>
                        <Text fontSize="sm" color="gray.500">
                          ID: {sale._id}
                        </Text>
                      </Td>
                      <Td>{formatDate(sale.data)}</Td>
                      <Td>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(calculateTotal(sale.produtos))}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" fontSize="sm">
                          {sale.produtos.length} itens
                        </Badge>
                      </Td>
                      <Td textAlign="center">
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(sale._id)}
                          aria-label="Excluir venda"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={6} p={0}>
                        <Collapse in={expandedSale === sale._id}>
                          <Box p={4} bg={expandedBgColor}>
                            <Stack spacing={3}>
                              <Heading size="sm" mb={2}>
                                Detalhes dos Produtos
                              </Heading>
                              <Table size="sm" variant="simple">
                                <Thead>
                                  <Tr>
                                    <Th>Produto</Th>
                                    <Th isNumeric>Quantidade</Th>
                                    <Th isNumeric>Preço Unit.</Th>
                                    <Th isNumeric>Subtotal</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {sale.produtos.map((produto, index) => (
                                    <Tr key={index}>
                                      <Td>{produto.nome}</Td>
                                      <Td isNumeric>{produto.quantidade}</Td>
                                      <Td isNumeric>
                                        {new Intl.NumberFormat("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        }).format(produto.preco)}
                                      </Td>
                                      <Td isNumeric>
                                        {new Intl.NumberFormat("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        }).format(
                                          produto.quantidade * produto.preco
                                        )}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Stack>
                          </Box>
                        </Collapse>
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Sales;
