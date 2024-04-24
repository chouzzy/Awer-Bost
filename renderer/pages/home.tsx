import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Button, Link as ChakraLink, Flex, FormControl, FormLabel, Input, Spinner, VStack } from '@chakra-ui/react'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'


export default function HomePage() {

  useEffect(() => {
    window.ipc.isLoading(async (value) => {
      setLoading(value)
      setFile(false)
    })
  }, [])

  const [file, setFile] = useState(true);
  const [loading, setLoading] = useState(false);

  const [initialDate, setInitialDate] = useState('')
  const [finalDate, setFinalDate] = useState('');

  async function handleSubmit() {

    if (!initialDate || !finalDate) {
      return alert('Insira a data inicial e a data final')
    }

    alert('Iniciando a busca')

    const initialDateObj = new Date(initialDate)
    const finalDateObj = new Date(finalDate)

    const date = {
      initial: {
        day: initialDateObj.getDate().toString().padStart(2, '0'),
        month: (initialDateObj.getMonth() + 1).toString().padStart(2, '0'),
        year: initialDateObj.getFullYear().toString(),
      },
      final: {
        day: finalDateObj.getDate().toString().padStart(2, '0'),
        month: (finalDateObj.getMonth() + 1).toString().padStart(2, '0'),
        year: finalDateObj.getFullYear().toString(),
      }
    }

    window.ipc.dateSelected(date)
  }
  async function saveFilePath() {
    await window.ipc.saveFile()
  }




  return (
    <React.Fragment>
      <Head>
        <title>B🔍TRT </title>
      </Head>
      <Container
        minHeight="100vh"
        bgImage={'/images/bgs/judge-bg2.png'}
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
            pb={8}
          >
            <Flex
              maxW={'300px'}
              maxH={'300px'}
              mt={12}
            >

              <Image
                alt="Logo icon"
                src={'/images/logos/boTRT-logo-2.png'}
                width={'300px'}
                height={'300px'}
              />
            </Flex>
            {
              loading ?
                <Spinner
                  my='auto'
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />
                :
                <Footer >

                  <Flex
                    flexDir={'column'}
                    gap={8}
                  >

                    {/* FILE INPUT */}
                    <Flex
                    >
                      <FormControl
                        isRequired={true}
                      >
                        <FormLabel
                          fontSize={'0.875rem'}
                          fontWeight={'700'}
                          letterSpacing={'5%'}
                          color={'white'}
                        >
                          Selecione a data inicial desejada clicando no <b>calendário</b>:
                        </FormLabel>
                        <Input
                          id='#initial-date'
                          type='datetime-local'
                          p={2}
                          color={'black'}
                          bg={'white'}
                          _hover={{ bg: 'purple.600', color: 'white' }}
                          onChange={(event) => { setInitialDate(event.target.value) }}
                        />
                      </FormControl>
                    </Flex>
                    <Flex
                    >
                      <FormControl
                        isRequired={true}
                      >
                        <FormLabel
                          fontSize={'0.875rem'}
                          fontWeight={'700'}
                          letterSpacing={'5%'}
                          color={'white'}
                        >
                          Selecione a data final desejada clicando no <b>calendário</b>:
                        </FormLabel>
                        <Input
                          id='#final-date'
                          type='datetime-local'
                          p={2}
                          color={'black'}
                          bg={'white'}
                          _hover={{ bg: 'purple.600', color: 'white' }}
                          onChange={(event) => { setFinalDate(event.target.value) }}
                        />
                      </FormControl>
                    </Flex>
                    <Flex
                      flexDir={'column'}
                    >
                      <Button
                        mx='auto'
                        variant="solid"
                        type='submit'
                        onClick={handleSubmit}
                        color='white'
                        bgGradient='linear(to-br, #FF5F5E, #FF5F5Ecc)'
                        rounded="button"
                        width={'100%'}
                        _hover={{ color: 'gray.200', transition: '500ms', textDecor: 'none' }}
                      >
                        Clique para iniciar
                      </Button>

                      <Button
                        mt={4}
                        mx='auto'
                        variant="solid"
                        type='submit'
                        onClick={
                          file ?
                            () => { '' }
                            :
                            () => saveFilePath()
                        }
                        color='white'
                        bgGradient={
                          file ?
                            'linear(to-br, #292f36, #292f36cc)'
                            :
                            'linear(to-br, #FF5F5E, #FF5F5Ecc)'
                        }
                        rounded="button"
                        width={'100%'}
                        cursor={
                          file ?
                            'default'
                            :
                            'pointer'
                        }
                        _hover={{ color: 'gray.200', transition: '500ms', textDecor: 'none' }}
                      >
                        Salvar
                      </Button>
                    </Flex>

                  </Flex>
                </Footer>
            }


          </VStack>

        </Flex>

      </Container>
    </React.Fragment>
  )
}
