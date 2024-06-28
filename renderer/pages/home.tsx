import React, { useContext, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Button, Link as ChakraLink, Flex, Input, VStack } from '@chakra-ui/react'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'

export default function HomePage() {

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  async function handleClick(message: string) {

    if (file) {
    
      if (typeof(file.path) == 'string') {
        window.ipc.sendMessage(file.path)
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

          justifyContent={'space-between'}
          align={'center'}

        >


          <VStack
            h='100vh'
            pt={24}
            pb={8}
          >

            <Image
              alt="Logo icon"
              src={'/images/logos/logo-bost.png'}
              width='360px'
              height='360px'
            />

            <Hero title={`Welcome to Bost⚡`} />

            <Footer >

              <Flex
                flexDir={'column'}
              >
                <Flex
                  p={4}
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
                </Flex>

                <Button
                  variant="solid"
                  onClick={() => handleClick(file)}
                  color='white'
                  bgGradient='linear(to-br, #FF5F5E, #FF5F5Ecc)'
                  rounded="button"
                  width="full"
                  _hover={{ color: 'gray.200', p: '6', transition: '500ms', textDecor: 'none' }}
                >
                  Clique para iniciar
                </Button>
              </Flex>
            </Footer>

          </VStack>

        </Flex>

      </Container>
    </React.Fragment>
  )
}
