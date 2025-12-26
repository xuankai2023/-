// 疫苗记录接口
export interface VaccineRecord {
    name: string;
    date: string;
    nextDate: string;
}

// 服务记录接口
export interface ServiceRecord {
    serviceName: string;
    date: string;
    price: number;
    status: '已完成' | '进行中' | '待预约';
    notes?: string;
}

// 宠物档案接口
export interface Pet {
    id: string;
    name: string;
    breed: string;
    gender: 'male' | 'female';
    birthDate: string;
    avatar: string;
    size: '小' | '中' | '大';
    weight: number;
    height: number;
    furColor: string;
    description: string;
    status: string;
    specialDiseases?: string;
    allergies?: string;
    lastCheckupDate: string;
    vaccineRecords: VaccineRecord[];
    serviceHistory: ServiceRecord[];
}

// 宠物类型配置接口
export interface PetType {
    id: string;
    name: string;
    icon: string;
    path: string;
    color: string;
    gradient: string;
    description: string;
}
export interface VaccineRecord {
    name: string;
    date: string;
    nextDate: string;
}
// 宠物类型配置数据
export const petTypes: PetType[] = [
    {
        id: 'cat',
        name: '猫咪',
        icon: '🐱',
        path: '/record/cat',
        color: '#ff6b9d',
        gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
        description: '温柔可爱的小猫咪'
    },
    {
        id: 'dog',
        name: '狗狗',
        icon: '🐶',
        path: '/record/dog',
        color: '#4ecdc4',
        gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        description: '忠诚活泼的汪星人'
    },
    {
        id: 'fish',
        name: '鱼类',
        icon: '🐠',
        path: '/record/fish',
        color: '#45b7d1',
        gradient: 'linear-gradient(135deg, #45b7d1 0%, #96c93d 100%)',
        description: '优雅美丽的观赏鱼'
    },
    {
        id: 'rabbit',
        name: '兔子',
        icon: '🐰',
        path: '/record/rabbit',
        color: '#f093fb',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: '活泼机灵的小兔子'
    },
    {
        id: 'other',
        name: '其他',
        icon: '🐹',
        path: '/record/other',
        color: '#fa709a',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '其他可爱的小宠物'
    }
];

// 销售占比数据接口
export interface SalesDistribution {
    value: number;
    name: string;
    itemStyle: { color: string };
}

// 药品合规数据接口
export interface ComplianceItem {
    key: string;
    name: string;
    status: string;
    guide: string;
    action: string;
    statusType: 'success' | 'error';
}

// 热力图数据接口
export interface HeatmapItem {
    name: string;
    value: number;
    itemStyle?: { color: string };
    children?: HeatmapItem[];
}

// 库存预警数据接口
export interface StockAlertItem {
    key: string;
    name: string;
    remaining: number;
    safetyLine: number;
    emoji: string;
    actionText: string;
    actionType: 'danger' | 'warning';
}

// 销售占比环形图数据
export const salesDistributionData: SalesDistribution[] = [
    { value: 42, name: '主粮', itemStyle: { color: '#FFA726' } },
    { value: 18, name: '用品', itemStyle: { color: '#4FC3F7' } },
    { value: 5, name: '药品', itemStyle: { color: '#66BB6A' } },
    { value: 35, name: '零食', itemStyle: { color: '#FFCC80' } }
];

// 药品合规专区表格数据
export const complianceData: ComplianceItem[] = [
    { key: '1', name: '体内驱虫片(幼犬)', status: '已认证', guide: '含米尔贝肟，8周以下慎用', action: '管理', statusType: 'success' },
    { key: '2', name: '关节止痛软膏', status: '缺检测报告', guide: '仅限外用', action: '立即补全', statusType: 'error' },
];

// 热力图数据 - 修改为符合ECharts treemap要求的格式
export const heatmapData: HeatmapItem[] = [
    {
        name: '宠物用品',
        value: 123, // 添加必需的 value 属性
        children: [
            { name: '全价猫粮', value: 30, itemStyle: { color: 'rgba(255, 167, 38, 1)' } },
            { name: '冻干零食', value: 20, itemStyle: { color: 'rgba(255, 167, 38, 0.8)' } },
            { name: '猫砂用品', value: 15, itemStyle: { color: 'rgba(79, 195, 247, 0.9)' } },
            { name: '驱虫药', value: 8, itemStyle: { color: 'rgba(102, 187, 106, 0.9)' } },
            { name: '智能饮水机', value: 12, itemStyle: { color: 'rgba(79, 195, 247, 0.6)' } },
            { name: '保健品', value: 5, itemStyle: { color: 'rgba(102, 187, 106, 0.5)' } },
            { name: '狗粮', value: 10, itemStyle: { color: 'rgba(255, 167, 38, 0.5)' } },
            { name: '猫罐头', value: 15, itemStyle: { color: 'rgba(255, 167, 38, 0.7)' } },
            { name: '宠物沐浴露', value: 8, itemStyle: { color: 'rgba(79, 195, 247, 0.7)' } }
        ]
    }
];

// 或者如果你想保持原始的扁平结构，可以使用这个版本
export const heatmapDataFlat: HeatmapItem[] = [
    { name: '全价猫粮', value: 30, itemStyle: { color: 'rgba(255, 167, 38, 1)' } },
    { name: '冻干零食', value: 20, itemStyle: { color: 'rgba(255, 167, 38, 0.8)' } },
    { name: '猫砂用品', value: 15, itemStyle: { color: 'rgba(79, 195, 247, 0.9)' } },
    { name: '驱虫药', value: 8, itemStyle: { color: 'rgba(102, 187, 106, 0.9)' } },
    { name: '智能饮水机', value: 12, itemStyle: { color: 'rgba(79, 195, 247, 0.6)' } },
    { name: '保健品', value: 5, itemStyle: { color: 'rgba(102, 187, 106, 0.5)' } },
    { name: '狗粮', value: 10, itemStyle: { color: 'rgba(255, 167, 38, 0.5)' } },
    { name: '猫罐头', value: 15, itemStyle: { color: 'rgba(255, 167, 38, 0.7)' } },
    { name: '宠物沐浴露', value: 8, itemStyle: { color: 'rgba(79, 195, 247, 0.7)' } }
];


// 库存预警列表数据
export const stockAlertData: StockAlertItem[] = [
    {
        key: '1',
        name: '膨润土猫砂',
        remaining: 72,
        safetyLine: 150,
        emoji: '🐱',
        actionText: '一键补货',
        actionType: 'danger'
    },
    {
        key: '2',
        name: '发声橡胶玩具',
        remaining: 0,
        safetyLine: 0,
        emoji: '🦴',
        actionText: '生成促销案',
        actionType: 'warning'
    }
];

// 模拟宠物档案数据
export const petRecords: Pet[] = [
    // 狗狗类
    {
        id: 'PET001',
        name: '黑哥',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [
            { name: '犬八联（核心）', date: '2024-03-15', nextDate: '2025-03-15' },
            { name: '狂犬病疫苗', date: '2024-04-10', nextDate: '2025-04-10' },
            { name: '体内外驱虫', date: '2024-09-01', nextDate: '2024-12-01' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [
            { name: '犬六联（加强）', date: '2024-02-20', nextDate: '2025-02-20' },
            { name: '狂犬病疫苗', date: '2024-03-05', nextDate: '2025-03-05' },
            { name: '体内驱虫', date: '2024-08-10', nextDate: '2024-11-10' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '可乐',
        breed: '哈士奇',
        gender: 'male',
        birthDate: '2021-03-12',
        avatar: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '大',
        weight: 28.5,
        height: 60,
        furColor: '黑白相间',
        description: '活泼好动，精力充沛，喜欢拆家',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-15',
        vaccineRecords: [
            { name: '犬四联（核心）', date: '2024-03-15', nextDate: '2025-03-15' },
            { name: '狂犬病疫苗', date: '2024-04-20', nextDate: '2025-04-20' },
            { name: '犬冠状病毒疫苗', date: '2024-05-10', nextDate: '2025-05-10' },
            { name: '体外驱虫', date: '2024-06-05', nextDate: '2024-09-05' },
            { name: '犬四联（加强）', date: '2024-09-18', nextDate: '2025-09-18' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '奶茶',
        breed: '柯基犬',
        gender: 'female',
        birthDate: '2022-01-20',
        avatar: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 12.3,
        height: 30,
        furColor: '棕色',
        description: '短腿可爱，性格温顺，喜欢撒娇',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-05',
        vaccineRecords: [
            { name: '幼犬三针（核心）', date: '2024-04-01', nextDate: '2025-04-01' },
            { name: '狂犬病疫苗', date: '2024-05-10', nextDate: '2025-05-10' },
            { name: '外驱虫（滴剂）', date: '2024-09-15', nextDate: '2024-12-15' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET005',
        name: '雪球',
        breed: '萨摩耶',
        gender: 'female',
        birthDate: '2020-08-05',
        avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '大',
        weight: 30.0,
        height: 58,
        furColor: '纯白色',
        description: '微笑天使，毛发光滑，喜欢奔跑',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-30',
        vaccineRecords: [
            { name: '犬八联（核心）', date: '2024-02-28', nextDate: '2025-02-28' },
            { name: '狂犬病疫苗', date: '2024-03-18', nextDate: '2025-03-18' },
            { name: '体内驱虫', date: '2024-07-01', nextDate: '2024-10-01' }
        ],
        serviceHistory: []
    },
    // 猫咪类
    {
        id: 'PET006',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [
            { name: '猫三联（核心）', date: '2024-03-10', nextDate: '2025-03-10' },
            { name: '狂犬病疫苗', date: '2024-04-05', nextDate: '2025-04-05' },
            { name: '体外驱虫', date: '2024-08-12', nextDate: '2024-11-12' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET007',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [
            { name: '猫三联（核心）', date: '2024-02-20', nextDate: '2025-02-20' },
            { name: '狂犬病疫苗', date: '2024-03-25', nextDate: '2025-03-25' },
            { name: '体内驱虫', date: '2024-08-01', nextDate: '2024-11-01' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET008',
        name: '丸子',
        breed: '布偶猫',
        gender: 'female',
        birthDate: '2021-11-15',
        avatar: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '中',
        weight: 6.8,
        height: 35,
        furColor: '白色加棕色',
        description: '颜值担当，性格粘人，喜欢被抚摸',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-25',
        vaccineRecords: [
            { name: '猫三联（核心）', date: '2024-01-30', nextDate: '2025-01-30' },
            { name: '狂犬病疫苗', date: '2024-03-02', nextDate: '2025-03-02' },
            { name: '体外驱虫', date: '2024-07-20', nextDate: '2024-10-20' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET009',
        name: '咖啡',
        breed: '美国短毛猫',
        gender: 'male',
        birthDate: '2022-05-20',
        avatar: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 5.5,
        height: 32,
        furColor: '棕色虎斑',
        description: '活泼好动，聪明伶俐，喜欢抓老鼠',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-08',
        vaccineRecords: [
            { name: '猫三联（核心）', date: '2024-04-12', nextDate: '2025-04-12' },
            { name: '狂犬病疫苗', date: '2024-05-05', nextDate: '2025-05-05' },
            { name: '体内驱虫', date: '2024-09-05', nextDate: '2024-12-05' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET010',
        name: '闪电',
        breed: '暹罗猫',
        gender: 'male',
        birthDate: '2021-07-08',
        avatar: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 4.8,
        height: 30,
        furColor: '重点色',
        description: '好奇心强，叫声独特，喜欢爬高',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-18',
        vaccineRecords: [
            { name: '猫三联（核心）', date: '2024-02-18', nextDate: '2025-02-18' },
            { name: '狂犬病疫苗', date: '2024-03-28', nextDate: '2025-03-28' },
            { name: '体外驱虫', date: '2024-08-08', nextDate: '2024-11-08' }
        ],
        serviceHistory: []
    },
    // 鱼类
    {
        id: 'PET011',
        name: '红红',
        breed: '红锦鲤',
        gender: 'male',
        birthDate: '2023-01-15',
        avatar: 'https://images.unsplash.com/photo-1517212168411-b31be8ac33d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.2,
        height: 15,
        furColor: '红色',
        description: '色彩鲜艳，游动优雅，寓意吉祥',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-03',
        vaccineRecords: [
            { name: '常规检疫/消毒', date: '2024-03-01', nextDate: '2025-03-01' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET012',
        name: '蓝宝石',
        breed: '蓝曼龙',
        gender: 'female',
        birthDate: '2023-03-20',
        avatar: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.1,
        height: 10,
        furColor: '蓝色',
        description: '身体呈蓝色，性情温和，适合混养',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-28',
        vaccineRecords: [
            { name: '寄生虫预防（外用）', date: '2024-04-12', nextDate: '2024-07-12' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET013',
        name: '斑马',
        breed: '斑马鱼',
        gender: 'male',
        birthDate: '2023-05-10',
        avatar: 'https://images.unsplash.com/photo-1571915923963-59973275d4f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.05,
        height: 8,
        furColor: '黑白条纹',
        description: '体型小巧，游动迅速，生命力强',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-05',
        vaccineRecords: [
            { name: '水体消毒/检疫', date: '2024-05-05', nextDate: '2025-05-05' }
        ],
        serviceHistory: []
    },
    // 兔子类
    {
        id: 'PET014',
        name: '雪球',
        breed: '垂耳兔',
        gender: 'female',
        birthDate: '2022-09-15',
        avatar: 'https://images.unsplash.com/photo-1587304465952-b6b556910f2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 1.2,
        height: 20,
        furColor: '纯白色',
        description: '耳朵下垂，性格温顺，喜欢吃胡萝卜',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-22',
        vaccineRecords: [
            { name: '巴氏杆菌疫苗', date: '2024-03-16', nextDate: '2025-03-16' },
            { name: '体外驱虫', date: '2024-08-20', nextDate: '2024-11-20' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET015',
        name: '奶茶',
        breed: '侏儒兔',
        gender: 'male',
        birthDate: '2023-01-10',
        avatar: 'https://images.unsplash.com/photo-1514589482840-681b79b720d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.8,
        height: 18,
        furColor: '棕色',
        description: '体型迷你，活泼可爱，喜欢跳跃',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-06',
        vaccineRecords: [
            { name: '兔瘟疫苗', date: '2024-04-08', nextDate: '2025-04-08' },
            { name: '体内驱虫', date: '2024-09-10', nextDate: '2024-12-10' }
        ],
        serviceHistory: []
    },
    // 其他宠物
    {
        id: 'PET016',
        name: '瓜子',
        breed: '仓鼠',
        gender: 'male',
        birthDate: '2023-04-18',
        avatar: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.15,
        height: 8,
        furColor: '金黄色',
        description: '小巧玲珑，夜间活动，喜欢跑轮',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-30',
        vaccineRecords: [
            { name: '常规检疫', date: '2024-05-12', nextDate: '2025-05-12' },
            { name: '体外驱虫', date: '2024-09-01', nextDate: '2024-12-01' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET017',
        name: '灰灰',
        breed: '龙猫',
        gender: 'female',
        birthDate: '2022-11-25',
        avatar: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.5,
        height: 15,
        furColor: '灰色',
        description: '毛质柔软，性格温顺，喜欢干燥环境',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-02',
        vaccineRecords: [
            { name: '真菌/寄生虫预防', date: '2024-06-06', nextDate: '2024-09-06' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET018',
        name: '鹦鹉',
        breed: '虎皮鹦鹉',
        gender: 'male',
        birthDate: '2022-06-15',
        avatar: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.1,
        height: 12,
        furColor: '黄绿相间',
        description: '羽毛鲜艳，能模仿声音，喜欢鸣叫',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-15',
        vaccineRecords: [
            { name: '禽类常规疫苗', date: '2024-03-18', nextDate: '2025-03-18' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET019',
        name: '小刺',
        breed: '刺猬',
        gender: 'male',
        birthDate: '2023-02-10',
        avatar: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.3,
        height: 10,
        furColor: '棕色带刺',
        description: '浑身带刺，夜间活动，喜欢吃昆虫',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-10-25',
        vaccineRecords: [
            { name: '狂犬/破伤风预防', date: '2024-05-22', nextDate: '2025-05-22' }
        ],
        serviceHistory: []
    },
    {
        id: 'PET020',
        name: '金金',
        breed: '金丝熊',
        gender: 'female',
        birthDate: '2023-05-05',
        avatar: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        size: '小',
        weight: 0.2,
        height: 9,
        furColor: '金黄色',
        description: '体型圆润，性格活泼，喜欢储粮',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-07',
        vaccineRecords: [
            { name: '常规检疫', date: '2024-06-15', nextDate: '2025-06-15' }
        ],
        serviceHistory: []
    },
];
