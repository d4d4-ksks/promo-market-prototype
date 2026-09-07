import { useMemo, useState } from 'react';
import { Button, Checkbox, Dropdown, Menu, message, Pagination, Select, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DownloadOutlined, EllipsisOutlined, FilterFilled, FullscreenOutlined,
  QuestionCircleOutlined, SearchOutlined, SettingOutlined, SyncOutlined, UploadOutlined,
} from '@ant-design/icons';

type Promo = {
  key: number; promo: string; status: string; name: string; city: string; type: string;
  category: string; start: string; finish: string; regular: string; promoPrice: string;
  discount: string; forecast: string; supplier: string;
};

const products = [
  ['300106', 'Гель-смазка Vizit | увлажняющий, 50 мл', 'Томск', 'Скидка', 'Красота и гигиена'],
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

const data: Promo[] = products.map((item, index) => ({
  key: index + 1, promo: item[0], status: index === 3 ? 'Ожидает согласования' : 'Проставление промоцен',
  name: item[1], city: item[2], type: item[3], category: item[4],
  start: `${12 + index}.09.26`, finish: `${19 + index}.09.26`,
  regular: `${349 + index * 27} ₽`, promoPrice: `${279 + index * 21} ₽`,
  discount: `${18 + (index % 5) * 3}%`, forecast: `${1200 + index * 146} шт.`, supplier: index % 2 ? 'ООО «Маркет Лайн»' : 'ООО «Юни Трейд»',
}));

const icon = <FilterFilled className="filter-icon" />;

function App() {
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnsType<Promo>>(() => [
    { title: '', width: 40, fixed: 'left', render: () => <span className="validation-dot" /> },
    { title: <span>Промо <SearchOutlined /></span>, dataIndex: 'promo', width: 100, fixed: 'left', render: value => <a>{value}</a> },
    { title: <span>Статус {icon}</span>, dataIndex: 'status', width: 210, fixed: 'left', render: value => <span><i className="blue-dot" />{value}</span> },
    { title: <span>Наименование <SearchOutlined /></span>, dataIndex: 'name', width: 240, fixed: 'left', ellipsis: true },
    { title: <span>География {icon}</span>, dataIndex: 'city', width: 160, fixed: 'left', render: value => <div>{value}<div className="muted">ЦФЗ: 30</div></div> },
    { title: <span>Тип промо {icon}</span>, dataIndex: 'type', width: 130 },
    { title: <span>Категория {icon}</span>, dataIndex: 'category', width: 170 },
    { title: 'Период промо', children: [
      { title: 'Начало', dataIndex: 'start', width: 105 }, { title: 'Окончание', dataIndex: 'finish', width: 105 },
    ]},
    { title: 'Цена', children: [
      { title: 'Регулярная', dataIndex: 'regular', width: 110, align: 'right' },
      { title: 'Промо', dataIndex: 'promoPrice', width: 100, align: 'right', render: v => <b>{v}</b> },
      { title: 'Скидка', dataIndex: 'discount', width: 90, align: 'right', render: v => <Tag color="blue">{v}</Tag> },
    ]},
    { title: <span>Прогноз продаж {icon}</span>, dataIndex: 'forecast', width: 150, align: 'right' },
    { title: <span>Поставщик {icon}</span>, dataIndex: 'supplier', width: 220 },
    { title: 'НДС, %', width: 90, align: 'right', render: () => '20%' },
    { title: '', width: 48, fixed: 'right', render: () => <Button type="text" icon={<EllipsisOutlined />} /> },
  ], []);

  const notify = (text: string) => message.info(`${text} — демо-действие`);
  const actions = <Menu items={[{ key: 'archive', label: 'Архив промо' }, { key: 'template', label: 'Скачать шаблон' }]} onClick={({key}) => notify(key === 'archive' ? 'Архив промо' : 'Скачать шаблон')} />;

  return <div className="app-shell">
    <header className="global-header">
      <div className="brand"><span className="logo-mark"><span /></span><b>Промотрон</b></div>
      <nav>{['Рабочее место','Поставщики','Заявки','Кампании','География','Параметры скидок','Калькулятор промо','Промо'].map(x => <button className={x === 'Промо' ? 'active' : ''} key={x}>{x}</button>)}</nav>
      <div className="profile"><QuestionCircleOutlined /><SyncOutlined /><span>Елена Терехова</span></div>
    </header>

    <section className="page-heading">
      <h1>Промо</h1>
      <div className="heading-actions">
        <Button icon={<DownloadOutlined />} onClick={() => notify('Скачать 111 400 промо')}>Скачать 111 400 промо</Button>
        <Button type="primary" icon={<UploadOutlined />} onClick={() => notify('Загрузить промоплан')}>Загрузить промоплан</Button>
        <Dropdown overlay={actions} trigger={['click']}><Button icon={<EllipsisOutlined />} /></Dropdown>
      </div>
    </section>

    <section className="toolbar">
      <div className="selection">{selected.length ? `Выбрано: ${selected.length}` : ''}</div>
      <div className="pager"><span>1–3000 из 111 400</span><Pagination size="small" current={page} total={50000} pageSize={1000} showSizeChanger={false} onChange={setPage} />
        <Select size="small" value="3000" style={{width: 142}}><Select.Option value="3000">3000 на странице</Select.Option></Select>
        <Tooltip title="Плотность строк"><Button type="text" icon={<SettingOutlined />} onClick={() => setCompact(v => !v)} /></Tooltip>
        <Button type="text" icon={<FullscreenOutlined />} onClick={() => document.documentElement.requestFullscreen?.()} />
      </div>
    </section>

    <main className={compact ? 'table-wrap compact' : 'table-wrap'}>
      <Table<Promo>
        bordered size="small" columns={columns} dataSource={data} pagination={false}
        scroll={{ x: 2058, y: 'calc(100vh - 253px)' }}
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected, columnWidth: 48 }}
      />
    </main>
  </div>;
}

export default App;
