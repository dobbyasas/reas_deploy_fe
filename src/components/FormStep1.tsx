// umožňuje uživateli vybrat typ nemovitosti, kraj a okres
// obsahuje interaktivní mapu České republiky a seznam okresů, které se zobrazí podle zvoleného kraje
// mapa by mohla být v separátní komponentě

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMap from 'highcharts/modules/map';
import mapDataCZ from '@highcharts/map-collection/countries/cz/cz-all.topo.json';

import bytIcon from '../assets/icons/ico-flat.png';
import dumIcon from '../assets/icons/ico-house.png';
import chataIcon from '../assets/icons/ico-cabin.png';
import stavebniPozemekIcon from '../assets/icons/ico-land.png';

// inicalizace mapy
HighchartsMap(Highcharts);

// props pro komponentu
interface FormStep1Props {
  nextStep: (data: any) => void;
}

const estateIcons: Record<string, string> = {
  Byt: bytIcon,
  Dům: dumIcon,
  Chata: chataIcon,
  'Stavební pozemek': stavebniPozemekIcon,
};

// validace formuláře pomocí Yup
const schema = yup.object().shape({
  estateType: yup.string().required('Prosím vyberte druh nemovitosti'),
  region: yup.string().required('Prosím vyberte kraj'),
  district: yup.string().required('Prosím vyberte okres'),
});

// data okresů pro kraje 
// určitě by to šlo udělat lépe skrze data mapy, ale bohužel jelikož jsem na podobné mapě dělal poprvé, nepodařilo se mi to, takže tohle je moje ne-elegantní řešení problému
const districtMapping: Record<string, string[]> = {
  'Praha': ['Praha'],
  'Stredocesky': ['Benešov', 'Beroun', 'Kladno', 'Kolín', 'Kutná Hora', 'Mělník', 'Mladá Boleslav', 'Nymburk', 'Praha-východ', 'Praha-západ', 'Příbram', 'Rakovník'],
  'Jihocesky': ['České Budějovice', 'Český Krumlov', 'Jindřichův Hradec', 'Písek', 'Prachatice', 'Strakonice', 'Tábor'],
  'Plzensky': ['Domažlice', 'Klatovy', 'Plzeň-město', 'Plzeň-jih', 'Plzeň-sever', 'Rokycany', 'Tachov'],
  'Karlovarsky': ['Cheb', 'Karlovy Vary', 'Sokolov'],
  'Ustecky': ['Děčín', 'Chomutov', 'Litoměřice', 'Louny', 'Most', 'Teplice', 'Ústí nad Labem'],
  'Liberecky': ['Česká Lípa', 'Jablonec nad Nisou', 'Liberec', 'Semily'],
  'Kralovehradecky': ['Hradec Králové', 'Jičín', 'Náchod', 'Rychnov nad Kněžnou', 'Trutnov'],
  'Pardubicky': ['Chrudim', 'Pardubice', 'Svitavy', 'Ústí nad Orlicí'],
  'Vysocina': ['Havlíčkův Brod', 'Jihlava', 'Pelhřimov', 'Třebíč', 'Žďár nad Sázavou'],
  'Jihomoravsky': ['Blansko', 'Brno-město', 'Brno-venkov', 'Břeclav', 'Hodonín', 'Vyškov', 'Znojmo'],
  'Olomoucky': ['Jeseník', 'Olomouc', 'Prostějov', 'Přerov', 'Šumperk'],
  'Zlinsky': ['Kroměříž', 'Uherské Hradiště', 'Vsetín', 'Zlín'],
  'Moravskoslezsky': ['Bruntál', 'Frýdek-Místek', 'Karviná', 'Nový Jičín', 'Opava', 'Ostrava-město'],
};

const FormStep1: React.FC<FormStep1Props> = ({ nextStep }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedEstateType, setSelectedEstateType] = useState<string | null>(null); 
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [districts, setDistricts] = useState<string[]>([]);

  const estateTypes = ['Byt', 'Dům', 'Chata', 'Stavební pozemek'];

  // funkce pro validaci a odeslání formuláře
  const onSubmit = (data: any) => {
    if (!selectedEstateType) {
      alert('Please select an estate type!');
      return;
    }
    if (!selectedRegion) {
      alert('Please select a region!');
      return;
    }
    if (!data.district) {
      alert('Please select a district!');
      return;
    }

    const formData = {
      ...data,
      estateType: selectedEstateType,
      region: selectedRegion,
    };

    nextStep(formData);
  };

  // nastaví typ nemovitosti a uloží ho do formuláře
  const handleEstateTypeClick = (type: string) => {
    setSelectedEstateType(type);
    setValue('estateType', type);
  };

  // funkce pro výběr okresu
  const handleRegionClick = (regionKey: string) => {
    const region = mapDataCZ.objects.default.geometries.find(
      (region) => region.properties['hc-key'] === regionKey
    );
  
    if (region) {
      const regionName = region.properties.name
        .normalize('NFD') // normalizace diakritiky
        .replace(/[\u0300-\u036f]/g, ''); // odebere diakritiku
  
      if (selectedRegion === regionName) {
        setSelectedRegion(null);
        setDistricts([]);
        setValue('region', '');
      } else {
        setSelectedRegion(regionName);
        setDistricts(districtMapping[regionName] || []);
        setValue('region', regionName);
      }
    }
  };
  
  // konfigurace mapy samotné
  const mapOptions: Highcharts.Options = {
    chart: {
      map: mapDataCZ,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    mapNavigation: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    series: [
      {
        type: 'map',
        data: mapDataCZ.objects.default.geometries.map((region) => ({
          'hc-key': region.properties['hc-key'],
          value:
            selectedRegion ===
            region.properties.name
              .normalize('NFD')
              .replace(/[\u0300-\u036f']/g, '')
              ? 2
              : 1,
        })),
        name: '',
        borderWidth: 1,
        borderColor: '#B0B0B0',
        states: {
          hover: {
            enabled: true,
            borderColor: '#B0B0B0',
            color: '#1975f0',
            brightness: 0,
          },
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
        point: {
          events: {
            click: function () {
              const regionKey = (this as any)['hc-key'];
              if (regionKey) {
                handleRegionClick(regionKey);
              }
            },
          },
        },
      },
    ],
    colorAxis: {
      dataClasses: [
        { from: 1, to: 1, color: '#FFFFFF' },
        { from: 2, to: 2, color: '#1975f0' },
      ],
      showInLegend: false,
    },
  };
  

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Kde se nachází Vaše nemovitost?</h1>
      <div>
        <label className="label">Vyberte druh nemovitosti</label>
        <div className="estate-buttons">
          {estateTypes.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => handleEstateTypeClick(type)}
              className={`estate-button ${selectedEstateType === type ? 'selected' : ''}`}
            >
              <img
                src={estateIcons[type]}
                alt={`${type} icon`}
                className="estate-icon"
              />
              <span>{type}</span>
            </button>
          ))}
        </div>
        <p className="error-message">{errors.estateType?.message}</p>
      </div>
      <div>
        <div id="container" className="map-container">
        <label className="label">Vyberte kraj kliknutím na mapu</label>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'mapChart'}
            options={mapOptions}
          />
        </div>
        <p className="error-message">{errors.region?.message}</p>
      </div>
      {selectedRegion && (
        <div>
          <label className="label">Vyberte okres</label>
          <div className="district-list">
            {districts.map((district) => (
              <div key={district} className="district-option">
                <input
                  type="radio"
                  value={district}
                  id={district}
                  {...register('district')}
                />
                <label htmlFor={district}>{district}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      <button type="submit">Další</button>
    </form>
  );
};

export default FormStep1;
