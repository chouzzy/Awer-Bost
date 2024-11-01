import { AudienciaSimplificada, excelDataIdentified, ProcessosArquivadosSimplificado } from "../types/audiencias";
import { ScrapeData } from "../types/generalTypes";
import exceljs from 'exceljs'
import { format } from 'date-fns';
import moment from "moment";

export async function writeData(
    listOfExcelData: excelDataIdentified[],
    filePath,
    painel: ScrapeData["painel"],
) {



    switch (painel) {
        case "Minha pauta":
            listOfExcelData.forEach(async (scrape, i) => {

                if (!scrape.excelData[0].numeroProcesso) {
                    return
                }

                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet('Dados da Audiência')


                const homeDir = require('os').homedir()
                const desktopDir = `${homeDir}/Desktop`

                // Definindo os cabeçalhos das colunas
                worksheet.columns = [
                    { header: 'Usuário', key: 'usuario', width: 15 },
                    { header: 'Número do Processo', key: 'numeroProcesso', width: 25 },
                    { header: 'Tipo de Audiência', key: 'tipoAudiencia', width: 30 },
                    { header: 'Órgão Julgador', key: 'orgaoJulgador', width: 50 }
                ];

                // Preenchendo as células com os dados
                scrape.excelData.forEach((audiencia, index) => {
                    worksheet.getRow(index + 2).values = [
                        audiencia.usuario,
                        audiencia.numeroProcesso,
                        audiencia.tipoAudiencia,
                        audiencia.orgaoJulgador
                    ];
                });

                // Salvando o arquivo Excel (adaptando o caminho do arquivo)
                const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
                // await workbook.xlsx.writeFile(`${desktopDir}/audiencias-${formattedDate}.xlsx`);
                setTimeout(async () => {
                    await workbook.xlsx.writeFile(`${filePath}/audiencias-${scrape.identifier.trt}_${scrape.identifier.grau}-${formattedDate}.xlsx`);
                }, 2000)
            })
            break;

        case "Processos arquivados":
            listOfExcelData.forEach(async (scrape, i) => {


                if (!scrape.excelData[0].numeroProcesso) {
                    return
                }

                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet('Dados da Audiência')


                const homeDir = require('os').homedir()
                const desktopDir = `${homeDir}/Desktop`

                // Definindo os cabeçalhos das colunas
                worksheet.columns = [
                    { header: 'Usuário', key: 'usuario', width: 15 },
                    { header: 'Número do Processo', key: 'numeroProcesso', width: 25 },
                    { header: 'Parte Autora', key: 'nomeParteAutora', width: 25 },
                    { header: 'Parte Reclamante', key: 'nomeParteRe', width: 30 },
                    { header: 'Data Arquivamento', key: 'dataArquivamento', width: 50 }
                ];

                // Preenchendo as células com os dados
                scrape.excelData.forEach((processoArquivado, index) => {
                    worksheet.getRow(index + 2).values = [
                        processoArquivado.usuario,
                        processoArquivado.numeroProcesso,
                        processoArquivado.nomeParteAutora,
                        processoArquivado.nomeParteRe,
                        moment(processoArquivado.dataArquivamento).format('DD/MM/YYYY'),
                    ];
                });

                // Salvando o arquivo Excel (adaptando o caminho do arquivo)
                const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
                // await workbook.xlsx.writeFile(`${desktopDir}/audiencias-${formattedDate}.xlsx`);
                setTimeout(async () => {
                    await workbook.xlsx.writeFile(`${filePath}/audiencias-${scrape.identifier.trt}_${scrape.identifier.grau}-${formattedDate}.xlsx`);
                }, 2000)
            })
            break;

        default:
            break;
    }




}
