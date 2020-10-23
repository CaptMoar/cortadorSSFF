const fs = require('fs');
const tamañoCorte = 100

const nombre = require('./../../cortesJSON/PRE/Nombre.json')
const rut = require('./../../cortesJSON/PRE/Rut.json')
const direccionPostal = require('./../../cortesJSON/PRE/Direccion_Postal.json')
const adicionales = require('./../../cortesJSON/PRE/Adicionales.json')
const plazo = require('./../../cortesJSON/PRE/Plazo.json')
const montoPie = require('./../../cortesJSON/PRE/Monto_Pie.json')
const folio = require('./../../cortesJSON/PRE/Folio.json')
const aceptacion = require('./../../cortesJSON/PRE/Aceptacion.json')

exports.documento = async (req) => {
    buenCorte = []
    malCorte = []

    listaDocumentos = await listarDocumentos()
    textos = await leerLista(listaDocumentos)
    cortes = await cortaTextos(textos, listaDocumentos)

    cortes.map(el => {
        if (!isNaN(el))
            malCorte.push(el)
        else
            buenCorte.push(el)
    })

    largo = cortes.length
    return {
        metricas: {
            'totalCasos': listaDocumentos.length,
            'casosBien': buenCorte.length, 'casosmMal': malCorte.length
        }, casos: {
            'casosMalos': malCorte,
            'cortes': buenCorte
        }
    }
}

listarDocumentos = () => {
    return new Promise(function (resolve, reject) {
        fs.readdir('./Casos PRE/', (err, filenames) => {
            if (err)
                reject(err);
            else
                resolve((filenames));
        });
    })
}

leerLista = async (lista) => {
    let total = await lista.map(el => {
        return fs.readFileSync(`./Casos PRE/${el}`, 'utf-8')
    })
    return total
}

cortaTextos = (textos, lista) => {

    let inicios = aceptacion.inicios.sort((a, b) => {
        return b.length - a.length;
    });

    let fines = aceptacion.fines.sort((a, b) => {
        return b.length - a.length;
    });


    let arrCortes = textos.map((el, index) => {
        let corteTemp;
        let parar = false;
        for (const inicio of inicios) {
            for (const fin of fines) {
                console.log(index, inicio, fin)
                if (el.includes(inicio) && el.includes(fin)) {

                    let corteInicio = el.indexOf(inicio) + inicio.length - tamañoCorte;
                    let corteFin = el.indexOf(fin, el.indexOf(inicio) + inicio.length) + tamañoCorte;
                    corteTemp = (
                        el.substring(corteInicio, corteFin)
                    ).trim()
                    corteTemp = corteTemp.substring(0, corteTemp.indexOf(inicio) + inicio.length).trim()
                        + ', '
                        + corteTemp.substring(
                            corteTemp.indexOf(inicio) + inicio.length,
                            corteTemp.indexOf(fin, corteTemp.indexOf(inicio) + inicio.length,)
                        ).trim()
                        + ', '
                        + corteTemp.substring(
                            corteTemp.indexOf(fin, corteTemp.indexOf(fin, corteTemp.indexOf(inicio) + inicio.length)),
                            corteTemp.length
                        ).trim()


                    parar = true;
                    break;
                }
            }
            if (parar) break;
        }
        try {
            if (corteTemp && corteTemp.length < 300) {
                corteTemp = corteTemp.split(' ')
                    .slice(0, -1)
                    .slice(1)
                    .join(' ')
                return corteTemp
            } else {
                return parseInt(lista[index].replace('.txt', ''))
            }
        } catch (error) {
            console.log(el)
        }
    })

    return arrCortes
}