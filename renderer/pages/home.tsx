import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Button, Flex, FormControl, FormLabel, Input, Select, Spinner, Text } from '@chakra-ui/react'

import * as yup from 'yup';
import { WarningIcon } from '@chakra-ui/icons'
import { Container } from '../components/Container'
import { trtSchema } from '../components/FormValidator'
import { TRTMinhaPauta } from '../components/TRTMinhaPauta'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { TRTProcessosArquivados } from '../components/TRTProcessosArquivados'


export default function HomePage() {

  useEffect(() => {
    window.ipc.isLoading(async (value) => {
      setLoading(value)
      setFile(false)
    })
  }, [])

  useEffect(() => {
    window.ipc.loginError(async (value) => {
      setLoading(value)
      setFile(false)
      setWarningAlert("Usuário ou senha inválidos. Por favor, verifique as informações e tente novamente.")
    })
  }, [])

  const [file, setFile] = useState(true);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [trt, setTRT] = useState('')
  const [painel, setPainel] = useState('')

  const [initialDate, setInitialDate] = useState('')
  const [finalDate, setFinalDate] = useState('');

  const [warningAlert, setWarningAlert] = useState('');

  async function handleSubmit() {

    if ((painel == "Minha pauta") && (!initialDate || !finalDate)) {
      return setWarningAlert('Insira a data inicial e a data final')
    }


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

    try {

      await trtSchema.validate({
        username,
        password,
        trt,
        painel
      })

    } catch (error) {

      if (error instanceof yup.ValidationError) {
        setWarningAlert(String(error.errors))
      }
      return
    }

    if (painel != 'Minha pauta' &&
      painel != 'Processos arquivados' &&
      painel != 'Pendentes de manifestação' &&
      painel != 'Acervo Geral') {
      return alert('Erro de seleção, favor contactar o desenvolvedor.')
    }

    window.ipc.scrapeData({
      username,
      password,
      trt,
      painel,
      date
    })
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
          h='100vh'
          w='100vw'
          flexDir={'column'}
          alignItems={'center'}
          pb={8}
        >
          <Flex
            maxW={'250px'}
            maxH={'250px'}
            mt={12}
          >

            <Image
              alt="Logo icon"
              src={'/images/logos/boTRT-logo.png'}
              width={'250px'}
              height={'250px'}
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
              <Flex >

                <Flex
                  flexDir={'column'}
                  gap={1}
                  w={'560px'}
                >
                  {warningAlert ?
                    <Flex mt={4} bg='#FF5F5E' borderRadius={4} color='white' p={2} alignItems={'center'} gap={4}>
                      <Flex> <WarningIcon fontSize={24} /> </Flex>
                      <Flex> <Text fontSize={'0.875rem'}> {warningAlert} </Text> </Flex>
                    </Flex>
                    :
                    ''
                  }

                  {/* INPUTS DE USO DO TRT */}
                  <Flex
                    w='100%'
                    gap={8}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >

                    {/* INPUT USERNAME, PASSWORD, TRT E SCRAPE */}
                    <Flex
                      gap={4}
                      flexDir={'column'}
                      w='100%'
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
                          Selecione o painel
                        </FormLabel>

                        <Select
                          id='#scrape'
                          color={'black'}
                          bg={'white'}
                          _hover={{ bg: 'purple.600', color: 'white' }}
                          value={painel}
                          onChange={(event) => { setPainel(event.target.value) }}
                        >
                          <option style={{ color: 'black' }}>{'Selecione'}</option>
                          <option style={{ color: 'black' }}>{'Minha pauta'}</option>
                          <option style={{ color: 'black' }}>{'Processos arquivados'}</option>
                          {/* <option style={{ color: 'black' }}>{'Acervo Geral'}</option> */}
                          {/* <option style={{ color: 'black' }}>{'Pendentes de manifestação'}</option> */}
                        </Select>
                      </FormControl>

                      <FormControl
                        isRequired={true}
                      >
                        <FormLabel
                          fontSize={'0.875rem'}
                          fontWeight={'700'}
                          letterSpacing={'5%'}
                          color={'white'}
                        >
                          Digite o login TRT
                        </FormLabel>
                        <Input
                          id='#username'
                          type='username'
                          p={1}
                          color={'black'}
                          bg={'white'}
                          _hover={{ bg: 'purple.600', color: 'white' }}
                          onChange={(event) => { setUsername(event.target.value) }}
                        />
                      </FormControl>

                      <FormControl
                        isRequired={true}
                      >
                        <FormLabel
                          fontSize={'0.875rem'}
                          fontWeight={'700'}
                          letterSpacing={'5%'}
                          color={'white'}
                        >
                          Senha TRT
                        </FormLabel>

                        <Input
                          id='#password'
                          type='password'
                          p={1}
                          color={'black'}
                          bg={'white'}
                          _hover={{ bg: 'purple.600', color: 'white' }}
                          onChange={(event) => { setPassword(event.target.value) }}
                        />
                      </FormControl>

                      {
                        painel != "Selecione" ?
                          <FormControl
                            isRequired={true}
                          >
                            <FormLabel
                              fontSize={'0.875rem'}
                              fontWeight={'700'}
                              letterSpacing={'5%'}
                              color={'white'}
                            >
                              Selecione o TRT
                            </FormLabel>

                            <Select
                              id='#TRT'
                              color={'black'}
                              bg={'white'}
                              _hover={{ bg: 'purple.600', color: 'white' }}
                              value={trt}
                              onChange={(event) => { setTRT(event.target.value) }}
                            >

                              {
                                painel == "Minha pauta" ?
                                  <TRTMinhaPauta />
                                  :
                                  ''
                              }
                              {
                                painel == "Processos arquivados" ?
                                  <TRTProcessosArquivados />
                                  :
                                  ''
                              }
                            </Select>
                          </FormControl>
                          :
                          ""
                      }

                    </Flex>

                  </Flex>

                  {
                    painel == "Minha pauta" ?
                      // {/* INPUT DATAS */}
                      <Flex gap={8} justifyContent={'space-between'}>
                        {/* INPUT DATA INICIAL */}
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
                              Selecione a data inicial da pesquisa:
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

                        {/* INPUT DATA FINAL */}
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
                              Selecione a data final da pesquisa:
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

                      </Flex>
                      :
                      ''
                  }


                  {/* BOTÃO START */}
                  <Flex
                    flexDir={'column'}
                  >

                    {/* BOTÃO START */}
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


                    {/* BOTÃO SAVE FILE */}
                    {
                      loading ?
                        ''
                        :
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
                    }
                  </Flex>

                </Flex>
              </Flex>
          }
        </Flex>


      </Container>
    </React.Fragment>
  )
}
