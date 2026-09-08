import { useMemo, useState } from 'react';
import { Button, Checkbox, Drawer, Dropdown, Menu, message, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AppstoreOutlined, ArrowRightOutlined, BgColorsOutlined, CalculatorOutlined, CloseOutlined, DownOutlined, EditOutlined,
  DownloadOutlined, EllipsisOutlined, EnvironmentOutlined, FileTextOutlined, FilterFilled, FilterOutlined,
  InboxOutlined, InfoCircleFilled, LeftOutlined, MenuFoldOutlined, PercentageOutlined, PlayCircleOutlined, PlusOutlined,
  QuestionCircleOutlined, RightOutlined, SearchOutlined, SettingOutlined, SlidersOutlined, SyncOutlined, UploadOutlined,
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
  competitorPrice: Math.round((642.01 + index * 12) / [0.98, 1.09, 1.18][index % 3]),
  competitorPrice2: Math.round((642.01 + index * 12) / [1.03, 1.12, 1.19][index % 3]), kvi: index % 3 ? '—' : 'KVI',
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

const parameterCategories = ['Автомобильные товары и запчасти', 'Аксессуары fashion', 'Алкоголь', 'Бады и Витамины', 'Бакалея', 'Безалкогольные напитки', 'Бытовая техника и Электроника', 'Все для дома', 'Гигиена', 'Детское питание'];
const parameterData = parameterCategories.map((category, index) => ({
  key: index + 1, category, level: 'КАТ. 1', geography: 'Вся', discount: index < 6 ? 10 : 15,
  targetPi: index < 8 ? 1 : 1.05, marginCommercial: 0, marginFront: 0, marginBack: index % 3,
  supplierInvestment: 80, samokatInvestment: 20,
}));

function App() {
  const [page, setPage] = useState<'promo' | 'parameters'>('promo');
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [authorFilter, setAuthorFilter] = useState(true);
  const [competitorPromo, setCompetitorPromo] = useState<Promo | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [pi1Open, setPi1Open] = useState(false);
  const [pi2Open, setPi2Open] = useState(false);
  const [pi1Filters, setPi1Filters] = useState<string[]>([]);
  const [pi2Filters, setPi2Filters] = useState<string[]>([]);
  const [draftAuthorFilter, setDraftAuthorFilter] = useState(true);
  const [draftPi1Filters, setDraftPi1Filters] = useState<string[]>([]);
  const [draftPi2Filters, setDraftPi2Filters] = useState<string[]>([]);

  const filteredData = useMemo(() => data.filter(record => {
    const pi1Matches = pi1Filters.length === 0 || pi1Filters.includes(piTone(piFor(record.salePromo, record.competitorPrice)));
    const pi2Matches = pi2Filters.length === 0 || pi2Filters.includes(piTone(piFor(record.salePromo, record.competitorPrice2)));
    return pi1Matches && pi2Matches;
  }), [pi1Filters, pi2Filters]);

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
      { title: '1 эш., ₽', dataIndex: 'competitorPrice', width: 160, align: 'right', render: (v, record) => <button className="competitor-price" onClick={() => setCompetitorPromo(record)}><span className="amount">{v}</span><small>(акц. цена)</small></button> },
      { title: 'PI 1 эш.', dataIndex: 'pi1', width: 92, align: 'right', render: (_v, record) => { const pi = piFor(record.salePromo, record.competitorPrice); return <Tag color={piTone(pi)}>{pi}</Tag>; } },
      { title: '2 эш., ₽', dataIndex: 'competitorPrice2', width: 126, align: 'right', render: (v, record) => <button className="competitor-price" onClick={() => setCompetitorPromo(record)}><span className="amount">{v}</span><small>(акц. цена)</small></button> },
      { title: 'PI 2 эш.', dataIndex: 'pi2', width: 92, align: 'right', render: (_v, record) => { const pi = piFor(record.salePromo, record.competitorPrice2); return <Tag color={piTone(pi)}>{pi}</Tag>; } },
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
    { title: '', width: 48, render: () => <Button type="text" icon={<EllipsisOutlined />} /> },
  ], []);

  const parameterColumns = useMemo<ColumnsType<any>>(() => [
    { title: 'Категория', dataIndex: 'category', width: 368 },
    { title: 'Уровень', dataIndex: 'level', width: 92, render: value => <span className="level-label">{value}</span> },
    { title: 'География', dataIndex: 'geography', width: 140 },
    { title: 'Скидка от, %', dataIndex: 'discount', width: 124 },
    { title: 'Целевой PI', dataIndex: 'targetPi', width: 124 },
    { title: 'Маржа комм., %', dataIndex: 'marginCommercial', width: 152 },
    { title: 'Маржа фронт, %', dataIndex: 'marginFront', width: 152 },
    { title: 'Маржа бэк, %', dataIndex: 'marginBack', width: 140 },
    { title: 'Инвестиции поставщика, %', dataIndex: 'supplierInvestment', width: 210 },
    { title: 'Инвестиции Самоката, %', dataIndex: 'samokatInvestment', width: 210 },
  ], []);

  const notify = (text: string) => message.info(`${text} — демо-действие`);
  const openFilters = () => {
    setDraftAuthorFilter(authorFilter);
    setDraftPi1Filters(pi1Filters);
    setDraftPi2Filters(pi2Filters);
    setFiltersVisible(true);
  };
  const closeFilters = () => setFiltersVisible(false);
  const applyFilters = () => {
    setAuthorFilter(draftAuthorFilter);
    setPi1Filters(draftPi1Filters);
    setPi2Filters(draftPi2Filters);
    setFiltersVisible(false);
  };
  const actions = <Menu items={[{ key: 'archive', label: 'Архив промо' }, { key: 'template', label: 'Скачать шаблон' }]} onClick={({key}) => notify(key === 'archive' ? 'Архив промо' : 'Скачать шаблон')} />;

  return <div className="app-shell">
    {page === 'promo' && <header className="global-header">
      <div className="brand"><img className="logo-mark" src="./logo.svg" alt="" /><b>Промотрон</b></div>
      <nav>{['Рабочее место','Поставщики','Заявки','Кампании','География','Параметры промо','Калькулятор промо','Промо'].map(x => {
        const active = x === 'Промо';
        return <button className={active ? 'active' : ''} key={x} onClick={() => {
          if (x === 'Промо' || x === 'Параметры промо') {
            setPage(x === 'Промо' ? 'promo' : 'parameters');
            setFiltersVisible(false);
            setCompetitorPromo(null);
          }
        }}>{x}</button>;
      })}</nav>
      <div className="profile"><QuestionCircleOutlined /><SyncOutlined /><span>Елена Терехова</span></div>
    </header>}

    {page === 'promo' ? <><section className="page-heading">
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
          <Button icon={<FilterOutlined />} className="filter-button" onClick={openFilters}>Фильтры</Button>
          {(authorFilter || pi1Filters.length > 0 || pi2Filters.length > 0) && <span className="filter-badge">{Number(authorFilter) + Number(pi1Filters.length > 0) + Number(pi2Filters.length > 0)}</span>}
        </div>
      </div>
      <div className="active-filters">
        {authorFilter && <button className="filter-chip" onClick={() => setAuthorFilter(false)}>Автор (1) <CloseOutlined /></button>}
        {pi1Filters.length > 0 && <button className="filter-chip" onClick={() => setPi1Filters([])}>PI 1 эш. ({pi1Filters.length}) <CloseOutlined /></button>}
        {pi2Filters.length > 0 && <button className="filter-chip" onClick={() => setPi2Filters([])}>PI 2 эш. ({pi2Filters.length}) <CloseOutlined /></button>}
        {(authorFilter || pi1Filters.length > 0 || pi2Filters.length > 0) && <button className="reset-filters" onClick={() => { setAuthorFilter(false); setPi1Filters([]); setPi2Filters([]); }}><CloseOutlined /> Сбросить все фильтры</button>}
      </div>
    </section>

    <main className="table-wrap">
      <Table<Promo>
        size="small" columns={columns} dataSource={filteredData} pagination={false}
        scroll={{ x: 5434, y: 'calc(100vh - 337px)' }}
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected, columnWidth: 48 }}
      />
    </main>
    {selected.length > 0 && <div className="bulk-actions">
      <span>Выбрано {selected.length} промо</span>
      <Button type="primary" icon={<EditOutlined />} onClick={() => notify(`Редактировать ${selected.length} промо`)}>Редактировать ({selected.length})</Button>
      <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => notify(`Запустить ${selected.length} промо`)}>Запустить ({selected.length})</Button>
      <Button className="bulk-more" icon={<EllipsisOutlined />} onClick={() => notify(`Другие действия для ${selected.length} промо`)} aria-label="Другие массовые действия" />
    </div>}
    </> : <div className="discount-layout">
      <aside className="discount-sidebar">
        <div className="discount-brand"><span className="discount-logo"><img src="./logo.svg" alt="" /></span><b>Промотрон</b></div>
        <div className="discount-menu">
          {[
            [<AppstoreOutlined />, 'Рабочее место'], [<InboxOutlined />, 'Поставщики'], [<FileTextOutlined />, 'Заявки'],
            [<BgColorsOutlined />, 'Кампании'], [<EnvironmentOutlined />, 'Кластеры'], [<SlidersOutlined />, 'Параметры скидок'],
            [<CalculatorOutlined />, 'Калькулятор промо'], [<PercentageOutlined />, 'Промо'],
          ].map(([menuIcon, label]) => <button key={String(label)} className={label === 'Параметры скидок' ? 'active' : ''} onClick={() => label === 'Промо' && setPage('promo')}><span>{menuIcon}</span>{label}</button>)}
        </div>
        <div className="discount-user"><span>eaterekhova@ecom.tech</span><MenuFoldOutlined /></div>
      </aside>
      <main className="discount-main">
        <header className="discount-header">
          <h1>Параметры скидок</h1>
          <div className="discount-tabs"><button className="active">Самокат</button><button>Мегамаркет</button></div>
        </header>
        <div className="discount-content">
          <section className="discount-notice"><InfoCircleFilled /><div><b>К категориям, для которых не созданы собственные параметры, применяются общие параметры</b><span>Минимальная маржинальность 0%, скидка 10% — 50%, инвестиции поставщик/Самокат 80%/20%</span></div></section>
          <section className="discount-card">
            <div className="discount-toolbar"><b>Параметры скидок</b><div><button className="ds-filter-button" onClick={openFilters}><FilterOutlined /></button><button className="ds-create-button" onClick={() => notify('Создать параметр')}><PlusOutlined />Создать</button></div></div>
            <div className="discount-filterbar">{['Категория', 'География', 'Скидка', 'Мин. маржинальность', 'Инвестиции', 'Целевой PI'].map(label => <button key={label}>{label}<DownOutlined /></button>)}</div>
            <div className="parameters-table">
              <Table columns={parameterColumns} dataSource={parameterData} pagination={false} rowSelection={{ columnWidth: 64 }} scroll={{ x: 1712, y: 'calc(100vh - 469px)' }} />
            </div>
            <div className="discount-pagination"><b>1–250 из 20 000</b><div><button disabled><LeftOutlined /></button>{['1','2','3','4','5','…','10'].map(value => <button className={value === '1' ? 'active' : ''} key={value}>{value}</button>)}<button><RightOutlined /></button></div></div>
          </section>
        </div>
      </main>
    </div>}
    <Drawer
      width={360}
      placement="right"
      closable={false}
      mask={false}
      visible={filtersVisible}
      onClose={closeFilters}
      className="filters-drawer"
      title={<div className="filters-title"><Button type="text" icon={<CloseOutlined />} onClick={closeFilters} aria-label="Закрыть фильтры" /><b>Фильтры</b></div>}
      footer={<div className="filters-footer"><Button onClick={() => { setDraftAuthorFilter(false); setDraftPi1Filters([]); setDraftPi2Filters([]); }}>Сбросить все фильтры</Button><Button type="primary" onClick={applyFilters}>Применить</Button></div>}
    >
      <div className="filter-list">
        <div className="filter-item author-filter"><span>Автор</span>{draftAuthorFilter && <><span className="author-count">1</span><button onClick={() => setDraftAuthorFilter(false)}>сбросить</button></>}<DownOutlined /></div>
        {['Статус', 'Промо id', 'Ошибки и предупреждения', 'Организация', 'Наименование', 'Период продажи'].map(label => <div className="filter-item" key={label}><span>{label}</span><DownOutlined /></div>)}
        <div className={`filter-item pi-filter ${pi1Open ? 'open' : ''}`}>
          <button className="filter-item-heading" onClick={() => setPi1Open(value => !value)}><span>PI 1 эш.</span><DownOutlined /></button>
          {pi1Open && <Checkbox.Group value={draftPi1Filters} onChange={values => setDraftPi1Filters(values as string[])}>
            <Checkbox value="green">Равен целевому</Checkbox>
            <Checkbox value="gold">Незначительно отличается от целевого</Checkbox>
            <Checkbox value="red">Значительно отличается от целевого</Checkbox>
          </Checkbox.Group>}
        </div>
        <div className={`filter-item pi-filter ${pi2Open ? 'open' : ''}`}>
          <button className="filter-item-heading" onClick={() => setPi2Open(value => !value)}><span>PI 2 эш.</span><DownOutlined /></button>
          {pi2Open && <Checkbox.Group value={draftPi2Filters} onChange={values => setDraftPi2Filters(values as string[])}>
            <Checkbox value="green">Равен целевому</Checkbox>
            <Checkbox value="gold">Незначительно отличается от целевого</Checkbox>
            <Checkbox value="red">Значительно отличается от целевого</Checkbox>
          </Checkbox.Group>}
        </div>
        {['Вид промо', 'Тип промо', 'Матрица', 'Категория', 'Период закупки', 'Кампания', 'Маржа комм. промо', 'Способ компенсации', 'Тип суперпромо', 'Эксп. коэф. суперпромо', 'Премия', 'Продажа: скидка', 'Поставщик', 'Рег. прайс', 'Маржа: комм. рег', 'Маржа: фронт рег.', 'Маржа: бэк рег.', 'Инвестиции поставщика', 'Инвестиции самоката', 'Сумма комп. OFF', 'ТО: коэф. эласт.', 'ТО: прогноз рег.', 'ТО: прогноз акц.', 'В распродаже', 'Номер заявки'].map(label => <div className="filter-item" key={label}><span>{label}</span><DownOutlined /></div>)}
      </div>
    </Drawer>
    <Drawer
      width={360}
      placement="right"
      closable={false}
      visible={Boolean(competitorPromo)}
      onClose={() => setCompetitorPromo(null)}
      className="competitor-drawer"
      title={<div className="drawer-title"><Button type="text" icon={<CloseOutlined />} onClick={() => setCompetitorPromo(null)} aria-label="Закрыть" /><span>{competitorPromo?.name}</span></div>}
    >
      <div className="competitor-list">
        {[
          { market: '1 эшелон', tier: 1, offset: 0 }, { market: 'Пятёрочка', tier: 1, offset: -5 }, { market: 'Магнит', tier: 1, offset: 4 },
          { market: '2 эшелон', tier: 2, offset: 0 }, { market: 'Озон', tier: 2, offset: -3 }, { market: 'Лавка', tier: 2, offset: 6 },
        ].map(({ market, tier, offset }) => {
          const tierRow = market.includes('эшелон');
          const basePrice = Number(tier === 1 ? competitorPromo?.competitorPrice : competitorPromo?.competitorPrice2) || 260;
          const price = Math.max(1, Math.round(basePrice + offset));
          const pi = competitorPromo ? piFor(competitorPromo.salePromo, price) : '1,06';
          return <div className={tierRow ? 'competitor-row tier-row' : 'competitor-row'} key={market}>
            <span>{market}</span><span>{price} ₽</span><Tag color={piTone(pi)}>{pi}</Tag><span>29.08.26</span>
          </div>;
        })}
      </div>
      <Button icon={<ArrowRightOutlined />} onClick={() => notify('Посмотреть историю')}>Посмотреть историю</Button>
    </Drawer>
  </div>;
}

export default App;
