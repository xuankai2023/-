// 销售品类库存数据
export interface ProductStock {
  id: number;
  name: string;
  brand: string;
  category: 'food' | 'supplies' | 'medicine';
  stock: number;
  price: number;
  unit: string;
}

export const productStocks: ProductStock[] = [
  // 主粮类（food）
  {
    id: 1,
    name: '成猫粮',
    brand: '皇家(Royal Canin)',
    category: 'food',
    stock: 120,
    price: 299,
    unit: '袋'
  },
  {
    id: 2,
    name: '幼犬粮',
    brand: '宝路(Pedigree)',
    category: 'food',
    stock: 85,
    price: 189,
    unit: '袋'
  },
  {
    id: 3,
    name: '猫咪主食罐',
    brand: '巅峰(ZIWI)',
    category: 'food',
    stock: 200,
    price: 32,
    unit: '罐'
  },
  {
    id: 4,
    name: '狗狗湿粮',
    brand: '比瑞吉(Bridge)',
    category: 'food',
    stock: 150,
    price: 25,
    unit: '罐'
  },
  {
    id: 5,
    name: '幼猫粮',
    brand: '渴望(Orijen)',
    category: 'food',
    stock: 90,
    price: 499,
    unit: '袋'
  },
  
  // 用品类（supplies）
  {
    id: 6,
    name: '猫砂',
    brand: '膨润土猫砂',
    category: 'supplies',
    stock: 300,
    price: 68,
    unit: '袋'
  },
  {
    id: 7,
    name: '狗绳',
    brand: '福莱希(Flexi)',
    category: 'supplies',
    stock: 120,
    price: 159,
    unit: '条'
  },
  {
    id: 8,
    name: '猫抓板',
    brand: '田田猫',
    category: 'supplies',
    stock: 180,
    price: 35,
    unit: '个'
  },
  {
    id: 9,
    name: '宠物窝',
    brand: '宜特(EETOYS)',
    category: 'supplies',
    stock: 75,
    price: 299,
    unit: '个'
  },
  {
    id: 10,
    name: '宠物梳',
    brand: '富美内特(FURminator)',
    category: 'supplies',
    stock: 140,
    price: 129,
    unit: '把'
  },
  
  // 药品类（medicine）
  {
    id: 11,
    name: '驱虫药',
    brand: '拜耳(Bayer)',
    category: 'medicine',
    stock: 200,
    price: 89,
    unit: '盒'
  },
  {
    id: 12,
    name: '益生菌',
    brand: '布拉迪酵母(Probios)',
    category: 'medicine',
    stock: 160,
    price: 158,
    unit: '盒'
  },
  {
    id: 13,
    name: '耳螨药',
    brand: '大宠爱(Revolution)',
    category: 'medicine',
    stock: 130,
    price: 128,
    unit: '支'
  },
  {
    id: 14,
    name: '眼药水',
    brand: '氯霉素',
    category: 'medicine',
    stock: 95,
    price: 45,
    unit: '瓶'
  },
  {
    id: 15,
    name: '皮肤病药膏',
    brand: '皮康王',
    category: 'medicine',
    stock: 110,
    price: 68,
    unit: '支'
  }
];
