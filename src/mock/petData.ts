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

// 模拟宠物档案数据
export const petRecords: Pet[] = [
    {
        id: 'PET001',
        name: '旺财',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: '/images/png/petSystem.png', // 这里换成你项目里真实存在的图片路径
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: '/images/png/petSystem.png',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET001',
        name: '旺财',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: '/images/png/petSystem.png', // 这里换成你项目里真实存在的图片路径
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: '/images/png/petSystem.png',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET001',
        name: '旺财',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: '/images/png/petSystem.png', // 这里换成你项目里真实存在的图片路径
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: '/images/png/petSystem.png',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET001',
        name: '旺财',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: '/images/png/petSystem.png', // 这里换成你项目里真实存在的图片路径
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: '/images/png/petSystem.png',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET001',
        name: '旺财',
        breed: '金毛寻回犬',
        gender: 'male',
        birthDate: '2020-05-15',
        avatar: '/images/png/petSystem.png', // 这里换成你项目里真实存在的图片路径
        size: '大',
        weight: 32.5,
        height: 65,
        furColor: '金黄色',
        description: '性格温和，喜欢和人互动，十分聪慧',
        status: '健康',
        specialDiseases: '无',
        allergies: '对鸡蛋轻微过敏',
        lastCheckupDate: '2024-10-20',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET002',
        name: '小花',
        breed: '波斯猫',
        gender: 'female',
        birthDate: '2021-08-22',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 4.2,
        height: 30,
        furColor: '白色',
        description: '温柔乖巧，喜欢在阳光下打盹',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-10',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET003',
        name: '咪咪',
        breed: '英国短毛猫',
        gender: 'female',
        birthDate: '2022-03-10',
        avatar: '/images/png/petSystem.png',
        size: '小',
        weight: 5.1,
        height: 28,
        furColor: '灰色',
        description: '调皮捣蛋，非常活跃，喜欢和玩具互动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-09-25',
        vaccineRecords: [],
        serviceHistory: []
    },
    {
        id: 'PET004',
        name: '大黄',
        breed: '中华田园犬',
        gender: 'male',
        birthDate: '2019-12-08',
        avatar: '/images/png/petSystem.png',
        size: '中',
        weight: 22,
        height: 55,
        furColor: '黄色',
        description: '忠诚勇敢，是主人的好伙伴，喜欢户外活动',
        status: '健康',
        specialDiseases: '无',
        allergies: '无',
        lastCheckupDate: '2024-11-01',
        vaccineRecords: [],
        serviceHistory: []
    },
];
