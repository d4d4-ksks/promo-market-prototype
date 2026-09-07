import { useMemo, useState } from 'react';
import { Button, Dropdown, Menu, message, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CloseOutlined, DownloadOutlined, EllipsisOutlined, FilterFilled, FilterOutlined,
  QuestionCircleOutlined, SearchOutlined, SettingOutlined, SyncOutlined, UploadOutlined,
} from '@ant-design/icons';

type Promo = { key: number; [key: string]: string | number };

const products = [
  ['300106', 'Гель для стирки Ariel | Color, 1,3 л', 'Томск', 'Скидка', 'Уход за домом'],
  ['300105', 'Пятновыводитель Wide Haiter | EX Power Foam, 400 мл', 'Москва', 'Скидка', 'Уход за домом'],
  ['300104', 'Средство Meine Liebe | Eco, для мытья посуды', 'Томск', 'Скидка', 'Уход за домом'],
  ['300103', 'Конфеты шоколадные Комильфо | фисташка, 116 г', 'Санкт-Петербург', '1 + 1', 'Сладости'],
  ['300102', 'Напиток овсяный Nemoloko | классический, 1 л', 'Москва', 'Промокод', 'Молочные продукты'],
  ['300101', 'Кофе Jardin | Colombia Supremo, зерно, 250 г', 'Казань', 'Скидка', 'Бакалея'],
  ['300100', 'Шампунь Natura Siberica | облепиховый, 400 мл', 'Новосибирск', 'Скидка', 'Красота и гигиена'],
  ['300099', 'Печенье Milka | Choco Cookie, 168 г', 'Екатеринбург', 'Выгодная цена', 'Сладости'],
  ['300098', 'Сыр полутвёрдый Ламбер | 50%, 230 г', 'Москва', 'Скидка', 'Молочные продукты'],
  ['300097', 'Корм для кошек Pro Plan | индейка, 85 г', 'Тула', 'Мультибай', 'Зоотовары'],
  ['300096', 'Средство для стирки BioMio | Bio Color, 1,5 л', 'Омск', 'Скидка', 'Уход за домом'],
  ['300095', 'Батончик Bombbar | шоколад-фундук, 60 г', 'Москва', 'Скидка', 'Здоровое питание'],
];

const numberFrom = (value: string | number) => Number(String(value).replace(',', '.').replace(/[^\d.-]/g, ''));
const piFor = (promoPrice: string | number, competitorPrice: string | number) =>
  (numberFrom(promoPrice) / numberFrom(competitorPrice)).toFixed(2).replace('.', ',');
const piTone = (value: string) => {
  const numeric = numberFrom(value);
  return numeric <= 1.05 ? 'green' : numeric < 1.15 ? 'gold' : 'red';
};

const data: Promo[] = products.map((item, index) => ({
  key: index + 1, promo: item[0], status: index === 3 ? 'Ожидает согласования' : 'Проставление промоцен',
  name: item[1], city: item[2], type: item[3], category: item[4],
  buyPeriod: `${5 + index}.03 – ${5 + index}.05`, buyRegular: `${195 + index * 8},91`, buyPromo: `${164 + index * 7},56`, buyDiscount: `${16 + index % 7},00`,
  salePeriod: `${5 + index}.03 – ${5 + index}.05`, saleRegular: `${683 + index * 13},52`, salePromo: `${642 + index * 12},01`, saleDiscount: `${18 + index % 8},00`,
  competitorPrice: Math.round((642.01 + index * 12) / [0.98, 1.09, 1.18][index % 3]), kvi: index % 3 ? '—' : 'KVI',
  regularPrice: index % 4 ? 'Да' : 'Нет', matrix: index % 5 ? 'Да' : 'Нет',
  marginPromo: `${15 + index % 4}`, marginRegular: `${10 + index % 5}`, marginFront: `${20 + index % 6}`, marginBack: `${15 + index % 3}`,
  investmentSupplier: `${70 - index % 6}`, investmentSamokat: `${30 + index % 6}`,
  compensation: `${5 + index % 4}`, compensationMethod: index % 2 ? 'Off' : 'On', compensationOff: `${211 + index * 7},82`, campaign: index % 3 ? 'Летний сезон' : 'Хеллоуин',
  superPromoType: index % 2 ? 'Главная витрина' : 'Наружная реклама', superPromoFactor: index % 2 ? '1,2' : '1,5',
  elasticity: `${(1.71 + index * .04).toFixed(2).replace('.', ',')}`, turnoverRegular: `${1701 + index * 193},00 ₽`, turnoverPromo: `${2916 + index * 241},00 ₽`,
  sale: index % 4 ? 'Нет' : 'Да', supplier: index % 2 ? 'ООО «Маркет Лайн»' : 'БОЛЕАР, ООО', bonus: `${15 + index % 4}`, vat: '20', request: `${6862 + index}`,
  marketer: index % 2 ? 'apetrova@samokat.ru' : 'mguguev@samokat.ru',
}));

const icon = <FilterFilled className="filter-icon" />;

function App() {
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [authorFilter, setAuthorFilter] = useState(true);

  const columns = useMemo<ColumnsType<Promo>>(() => [
    { title: '', width: 40, fixed: 'left', render: () => <span className="validation-dot" /> },
    { title: <span>Промо <SearchOutlined /></span>, dataIndex: 'promo', width: 100, fixed: 'left', render: value => <a>{value}</a> },
    { title: <span>Статус {icon}</span>, dataIndex: 'status', width: 210, fixed: 'left', render: value => <span><i className="blue-dot" />{value}</span> },
    { title: <span>Наименование <SearchOutlined /></span>, dataIndex: 'name', width: 240, fixed: 'left', ellipsis: true },
    { title: <span>География {icon}</span>, dataIndex: 'city', width: 160, fixed: 'left', render: value => <div>{value}<div className="muted">ЦФЗ: 30</div></div> },
    { title: <span>Тип промо {icon}</span>, dataIndex: 'type', width: 130 },
    { title: <span>Категория {icon}</span>, dataIndex: 'category', width: 160 },
    { title: 'Закупка', children: [
      { title: <span>Период {icon}</span>, dataIndex: 'buyPeriod', width: 160 },
      { title: 'Рег. цена, ₽', dataIndex: 'buyRegular', width: 92, align: 'right' },
      { title: 'Акц. цена, ₽', dataIndex: 'buyPromo', width: 92, align: 'right' },
      { title: 'Скидка, %', dataIndex: 'buyDiscount', width: 92, align: 'right' },
    ]},
    { title: 'Продажа', children: [
      { title: <span>Период {icon}</span>, dataIndex: 'salePeriod', width: 160 },
      { title: 'Рег. цена, ₽', dataIndex: 'saleRegular', width: 92, align: 'right' },
      { title: 'Акц. цена, ₽', dataIndex: 'salePromo', width: 92, align: 'right' },
      { title: 'Скидка, %', dataIndex: 'saleDiscount', width: 92, align: 'right' },
    ]},
    { title: 'Конкуренты', children: [
      { title: 'Цена, ₽', dataIndex: 'competitorPrice', width: 160, align: 'right', render: v => <span className="competitor-price"><span className="amount">{v}</span><small>(акц. цена)</small></span> },
      { title: 'PI', dataIndex: 'pi', width: 92, align: 'right', render: (_v, record) => { const pi = piFor(record.salePromo, record.competitorPrice); return <Tag color={piTone(pi)}>{pi}</Tag>; } },
    ]},
    { title: 'KVI', dataIndex: 'kvi', width: 60 },
    { title: 'Рег. прайс', dataIndex: 'regularPrice', width: 110 },
    { title: 'Матрица', dataIndex: 'matrix', width: 110 },
    { title: 'Маржа, %', children: [
      { title: 'Комм. промо', dataIndex: 'marginPromo', width: 85, align: 'right' },
      { title: 'Комм. рег.', dataIndex: 'marginRegular', width: 85, align: 'right' },
      { title: 'Фронт. рег.', dataIndex: 'marginFront', width: 85, align: 'right' },
      { title: 'Бэк. рег.', dataIndex: 'marginBack', width: 85, align: 'right' },
    ]},
    { title: 'Инвестиции, %', children: [
      { title: 'Пост.', dataIndex: 'investmentSupplier', width: 85, align: 'right' },
      { title: 'Самокат', dataIndex: 'investmentSamokat', width: 95, align: 'right' },
    ]},
    { title: 'Компенсация СММ, ₽', dataIndex: 'compensation', width: 130 },
    { title: 'Способ компенсации', dataIndex: 'compensationMethod', width: 130 },
    { title: 'Сумма комп. OFF', dataIndex: 'compensationOff', width: 100, align: 'right' },
    { title: <span>Кампания {icon}</span>, dataIndex: 'campaign', width: 160 },
    { title: 'Суперпромо', children: [
      { title: 'Тип', dataIndex: 'superPromoType', width: 192 },
      { title: 'Эксп. коэф.', dataIndex: 'superPromoFactor', width: 100, align: 'right' },
    ]},
    { title: 'Товарооборот (ТО)', children: [
      { title: 'Коэф. эласт.', dataIndex: 'elasticity', width: 80, align: 'right' },
      { title: 'Прогноз рег.', dataIndex: 'turnoverRegular', width: 136, align: 'right' },
      { title: 'Прогноз акц.', dataIndex: 'turnoverPromo', width: 136, align: 'right' },
    ]},
    { title: <span>В распродаже {icon}</span>, dataIndex: 'sale', width: 140 },
    { title: <span>Поставщик {icon}</span>, dataIndex: 'supplier', width: 260, render: v => <a>{v}</a> },
    { title: 'Премия', dataIndex: 'bonus', width: 120, align: 'right' },
    { title: 'НДС, %', dataIndex: 'vat', width: 120, align: 'right' },
    { title: <span>Номер заявки <SearchOutlined /></span>, dataIndex: 'request', width: 100, render: v => <a>{v}</a> },
    { title: <span>Трейд-маркетолог {icon}</span>, dataIndex: 'marketer', width: 260 },
    { title: '', width: 48, fixed: 'right', render: () => <Button type="text" icon={<EllipsisOutlined />} /> },
  ], []);

  const notify = (text: string) => message.info(`${text} — демо-действие`);
  const actions = <Menu items={[{ key: 'archive', label: 'Архив промо' }, { key: 'template', label: 'Скачать шаблон' }]} onClick={({key}) => notify(key === 'archive' ? 'Архив промо' : 'Скачать шаблон')} />;

  return <div className="app-shell">
    <header className="global-header">
      <div className="brand"><img className="logo-mark" src="./logo.svg" alt="" /><b>Промотрон</b></div>
      <nav>{['Рабочее место','Поставщики','Заявки','Кампании','География','Параметры скидок','Калькулятор промо','Промо'].map(x => <button className={x === 'Промо' ? 'active' : ''} key={x}>{x}</button>)}</nav>
      <div className="profile"><QuestionCircleOutlined /><SyncOutlined /><span>Елена Терехова</span></div>
    </header>

    <section className="page-heading">
      <h1>Промо</h1>
      <div className="heading-actions">
        <Button type="primary" icon={<UploadOutlined />} onClick={() => notify('Загрузить промоплан')}>Загрузить промоплан</Button>
        <Dropdown overlay={actions} trigger={['click']}><Button icon={<EllipsisOutlined />} /></Dropdown>
      </div>
    </section>

    <section className="table-controls">
      <div className="export-row">
        <div className="export-summary">
          <span>Показано 100 000 актуальных промо</span>
          <Button icon={<DownloadOutlined />} onClick={() => notify('Скачать промо')}>Скачать промо</Button>
          <span className="vertical-rule" />
          <span>Все найденные промо можно <a onClick={() => notify('Скачать все найденные промо')}>скачать здесь</a></span>
        </div>
        <div className="export-actions">
          <Button type="link" icon={<SettingOutlined />} onClick={() => notify('Настроить выгрузку')}>Настроить выгрузку</Button>
          <span className="export-limit">80/80</span>
          <Button icon={<FilterOutlined />} className="filter-button" onClick={() => notify('Фильтры')}>Фильтры</Button>
          {authorFilter && <span className="filter-badge">1</span>}
        </div>
      </div>
      <div className="active-filters">
        {authorFilter && <button className="filter-chip" onClick={() => setAuthorFilter(false)}>Автор (1) <CloseOutlined /></button>}
        {authorFilter && <button className="reset-filters" onClick={() => setAuthorFilter(false)}><CloseOutlined /> Сбросить все фильтры</button>}
        {selected.length > 0 && <span className="selection">Выбрано: {selected.length}</span>}
      </div>
    </section>

    <main className="table-wrap">
      <Table<Promo>
        size="small" columns={columns} dataSource={data} pagination={false}
        scroll={{ x: 5216, y: 'calc(100vh - 337px)' }}
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected, columnWidth: 48 }}
      />
    </main>
  </div>;
}

export default App;
