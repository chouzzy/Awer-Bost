import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Flex, Spinner } from '@chakra-ui/react'



import { SaveButton } from '../components/HomeButtons/SaveButton';
import { BackButton } from '../components/HomeButtons/BackButton';

import { Container } from '../components/InheritComponents/Container'
import { DarkModeSwitch } from '../components/InheritComponents/DarkModeSwitch'

import { ImportOperation } from '../components/ImportOperation/ImportOperation';

import { SelectOperation } from '../components/SelectOperation/SelectOperation';

import { PasswordInput } from '../components/HomeInputs/PasswordInput';
import { LoginInput } from '../components/HomeInputs/LoginInput';
import { DateInput } from '../components/HomeInputs/DateInput';

import { SelectTRT } from '../components/Selects/SelectTRT';
import { SelectPainel } from '../components/Selects/SelectPainel';

import { Logo } from '../components/Banners/Logo';
import { trtSchema } from '../components/Validation/FormValidator'
import { WarningAlert } from '../components/Alerts/WarningAlert';
import { StartButtonSingleSearch } from '../components/HomeButtons/StartButtonSingleSearch';
import { handleSubmitSingleSearch } from '../services/SingleSearch';


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

  useEffect(() => {
    window.ipc.processFinished(async (value) => {
      setProcessFinished(true)
    })
  }, [])

  useEffect(() => {
    window.ipc.progressPercentual(async (value) => {
      setProgressPercentual(value)
    })
  }, [])

  useEffect(() => {
    window.ipc.processosEncontrados(async (value) => {
      setProcessosEncontrados(value)
    })
  }, [])

  useEffect(() => {
    window.ipc.invalidExcelFormat(async (value) => {
      setWarningAlert(value)
    })
  }, [])

  useEffect(() => {
    window.ipc.progressMessagesDetails(async (value) => {
      setProgressMessages(value)
    })
  }, [])

  const [file, setFile] = useState(true);

  const [loading, setLoading] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);
  const [progressPercentual, setProgressPercentual] = useState("0");
  const [processosEncontrados, setProcessosEncontrados] = useState(0);

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [trt, setTRT] = useState('')
  const [painel, setPainel] = useState('Selecione')

  const [initialDate, setInitialDate] = useState('')
  const [finalDate, setFinalDate] = useState('');

  const [warningAlert, setWarningAlert] = useState('');
  const [progressMessages, setProgressMessages] = useState('');

  const [multiOperation, setMultiOperation] = useState(false);

  const [isOperationSelected, setIsOperationSelected] = useState(false)

  const [filePath, setFilePath] = useState(null);


  const singleSearchData = {
    painel,
    initialDate,
    finalDate,
    setWarningAlert,
    username,
    password,
    trt
  }


  async function saveFilePath() {
    await window.ipc.saveExcel()
  }

  return (
    <React.Fragment>

      <Head>
        <title>B🔍TRT </title>
      </Head>

      <Container
        minHeight="100vh"
        // bgImage={'/images/bgs/judge-bg2.png'}
        bgGradient={'linear(to-br, #FF5F5E22, #FF5F5E77)'}
        bgColor={'black'}
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
          gap={8}
        >
          <Logo />

          {warningAlert ?
            <WarningAlert warningAlert={warningAlert} setWarningAlert={setWarningAlert} />
            :
            ''
          }
          {
            loading ?
              // TELA DE LOADING
              <Flex flexDir={'column'} alignItems={'center'} justifyContent={'center'} gap={4}>

                <Spinner
                  my='auto'
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />

                <Flex flexDir={'column'} gap={4} color='white' alignItems={'center'} justifyContent={'center'}>
                  <Flex gap={2}>
                    <Flex>
                      Buscando dados...
                    </Flex>
                    <Flex>
                      {progressPercentual}%
                    </Flex>
                  </Flex>
                  <Flex>
                    {progressMessages}
                  </Flex>
                </Flex>
              </Flex>
              :
              <Flex>

                {processFinished ?
                  <Flex gap={8} flexDir='column' alignItems={'center'} justifyContent={'center'}>
                    <BackButton setProcessFinished={setProcessFinished} />
                    {processosEncontrados > 0 ?
                    <SaveButton file={file} saveFilePath={saveFilePath} disable={processosEncontrados == 0 ? true : false} />
                    :
                    ""
                    }
                    <Flex color='white' fontWeight={'bold'}>
                      <Flex>
                        Um total de {processosEncontrados} TRTs retornaram dados na pesquisa.
                      </Flex>
                    </Flex>
                  </Flex>
                  :

                  <Flex
                    flexDir={'column'}
                    gap={1}
                    w={'560px'}
                  >


                    {/* // INPUTS DE USO DO TRT */}
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

                        <SelectOperation
                          multiOperation={multiOperation}
                          setMultiOperation={setMultiOperation}
                          isOperationSelected={isOperationSelected}
                          setIsOperationSelected={setIsOperationSelected}
                        />

                        <SelectPainel painel={painel} setPainel={setPainel} />


                        {isOperationSelected ?
                          <>
                            {
                              multiOperation ?
                                <ImportOperation
                                  filePath={filePath}
                                  setFilePath={setFilePath}
                                  painel={painel}
                                  setWarningAlert={setWarningAlert}
                                />
                                : <>
                                  {
                                    painel != "Selecione" ?
                                      <>
                                        <LoginInput setUsername={setUsername} />
                                        <PasswordInput setPassword={setPassword} />
                                        <SelectTRT trt={trt} setTRT={setTRT} painel={painel} />

                                      </>
                                      :
                                      ""
                                  }
                                </>

                            }
                          </>
                          :
                          ''
                        }

                      </Flex>

                    </Flex>

                    {multiOperation ?
                      ''
                      :

                      <>
                        {
                          isOperationSelected ?
                            <>
                              {
                                painel == "Minha pauta" ?
                                  <>
                                    {/* INPUT DATAS */}
                                    <DateInput setFinalDate={setFinalDate} setInitialDate={setInitialDate} />

                                    {/* BOTÃO START */}
                                    <Flex
                                      flexDir={'column'}
                                      py={4}
                                      gap={4}
                                    >
                                      <StartButtonSingleSearch singleSearchData={singleSearchData} />
                                    </Flex>
                                  </>
                                  :
                                  ''
                              }
                              {
                                painel == "Processos arquivados" ?
                                  <>
                                    {/* BOTÃO START */}
                                    <Flex
                                      flexDir={'column'}
                                      py={4}
                                      gap={4}
                                    >

                                      <StartButtonSingleSearch singleSearchData={singleSearchData} />
                                    </Flex>
                                  </>
                                  :
                                  ''
                              }
                            </>
                            :
                            ''


                        }
                      </>
                    }

                  </Flex>
                }
              </Flex>
          }
        </Flex>


      </Container>
    </React.Fragment>
  )
}
