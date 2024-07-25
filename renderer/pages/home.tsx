import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Button, Link as ChakraLink, Flex, FormControl, FormLabel, Input, Link, Spinner, Text, VStack } from '@chakra-ui/react'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'

export default function HomePage() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consoleMessage, setConsoleMessage] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.ipc.isLoading(async (isLoading) => {
      setLoading(isLoading)
    })
  }, [])

  useEffect(() => {
    window.ipc.consoleMessages(async (consoleMessage) => {
      setConsoleMessage(consoleMessage)
    })
  }, [])



  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  async function handleClick(message: string) {

    if (login.length != 11) {
      return alert("O login deve possuir 11 caracteres, ex: iob.1234567")
    }

    if (password.length < 1) {
      return alert("Digite sua senha IOB.")
    }

    if (file) {

      if (typeof (file.path) == 'string') {
        window.ipc.sendUserData({
          username: login,
          password: password,
          filePath: file.path
        })
      }

    } else {
      return alert("Erro: Insira uma planilha")
    }

  }




  return (
    <React.Fragment>
      <Head>
        <title>BO⚡T </title>
      </Head>
      <Container
        minHeight="100vh"
        bgColor='#000000'
        bgImage={'/images/bgs/bot-background.png'}
        bgSize={'cover'}
        bgPos={'center'}
        bgRepeat={'no-repeat'}
      >

        <DarkModeSwitch />

        <Flex
          minH='100vh'
          my='auto'

          flexDir={'column'}

          justifyContent={'center'}
          align={'center'}

          gap={24}

        >

          <Flex
            flexDir={'column'}
          >

            <Flex
              flexDir={'column'}
            >

              <Image
                alt="Logo icon"
                src={'/images/logos/logo-bost.png'}
                width='256px'
                height='256px'
              />

            </Flex>

          </Flex>


          <Flex
            minH='208px'
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >

            <Footer flexDir={'column'} justifyContent={'center'} alignItems={'center'} >

              {
                loading ?
                  <Flex
                    flexDir={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >

                    <Spinner
                      my={12}
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl'
                    />



                  </Flex>
                  :


                  <Flex
                    flexDir={'column'}
                    maxW={'400px'}
                  >
                    {/* LOGIN E SENHA */}
                    <Flex
                      flexDir={'column'}
                    >
                      <FormControl mb={4}> {/* Adiciona um espaçamento inferior ao FormControl */}
                        <FormLabel w='100%' textAlign={'center'} color={'white'}>Autenticação IOB</FormLabel>
                        <Input
                          bgGradient="linear(to-r, #00000055, #02243055)"
                          color={'white'}
                          fontSize={'0.9rem'}
                          type="text" // Tipo de input para login
                          placeholder="Digite seu login IOB" // Adicione um placeholder para o input
                          onChange={(e) => { setLogin(e.target.value) }}
                        // Adicione aqui um estado para armazenar o valor do login e uma função onChange para atualizar o estado
                        />
                      </FormControl>

                      <FormControl>
                        <Input
                          bgGradient="linear(to-r, #00000055, #02243055)"
                          color={'white'}
                          fontSize={'0.9rem'}
                          type="password" // Tipo de input para senha
                          placeholder="Digite sua senha IOB" // Adicione um placeholder para o input
                          onChange={(e) => { setPassword(e.target.value) }}
                        // Adicione aqui um estado para armazenar o valor da senha e uma função onChange para atualizar o estado
                        />
                      </FormControl>
                    </Flex>

                    {/* LOGO, INPUT E BOTÃO DE INÍCIO */}
                    <Flex
                      flexDir={'row'}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >

                      <Flex
                        mt={8}
                        mb={2}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={2}
                        w='100%'
                      >

                        <Input
                          type='file' id='fileInput'
                          accept='xlsx'
                          bgGradient="linear(to-r, #00000055, #02243055)"
                          color={'white'}
                          fontSize={'0.9rem'}
                          flexDir={'column'}
                          onChange={handleFileChange}
                          p={1.5}
                        />


                        <Button
                          variant="solid"
                          onClick={() => handleClick(file)}
                          color='white'
                          bgGradient='linear(to-br, #fb6273, #fb6273cc)'
                          width="64px"
                          _hover={{ color: 'gray.200', bgColor: "#fc5b95", transition: '500ms', textDecor: 'none' }}
                        >
                          Iniciar
                        </Button>
                      </Flex>

                    </Flex>


                    <Flex
                      gap={2}
                      flexDir={'column'}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <Link
                        color={'white'}
                        _hover={{ textDecor: 'none', color: 'purple.100' }}
                        href='https://drive.usercontent.google.com/download?id=1S0SjT-i59569urJbUzl-ucCZPURjzaPM&export=download&authuser=2&confirm=t&uuid=fd017598-d0c0-4d4e-b8cf-efc4e156bb22&at=APZUnTUO1pgj4e1UuxSD1TtMFfqF:1719939994144'
                        target='_blank'
                        rel='external'
                      >
                        <Flex>
                          <Text
                            fontSize={'1rem'}
                            textAlign={'center'}
                          >
                            Caso não possua a planilha de operação, <b> clique aqui </b> e baixe a planilha modelo
                          </Text>
                        </Flex>
                      </Link>

                    </Flex>
                  </Flex>
              }

              <Flex>

                <Text
                  color={'wheat'}
                  mt={4}
                  px={4}
                  textAlign={'center'}
                >
                  {consoleMessage}
                </Text>

              </Flex>
            </Footer>

          </Flex>





        </Flex>

      </Container>
    </React.Fragment>
  )
}
