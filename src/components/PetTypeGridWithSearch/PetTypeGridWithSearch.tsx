import React from 'react';
import { Card } from 'antd';
import RecordSearchFilter, { RecordSearchFilterProps } from '../RecordSearchFilter/RecordSearchFilter';
import './PetTypeGridWithSearch.css';

export interface PetType {
  id: string;
  name: string;
  path: string;
  gradient: string;
  description: string;
}

export interface PetTypeGridWithSearchProps extends Omit<RecordSearchFilterProps, 'className'> {
  petTypes: PetType[];
  getPetCountByType: (typeId: string) => number;
  getPetTypeIcon: (typeId: string) => string;
  onCardClick: (path: string) => void;
}

function PetTypeGridWithSearch({
  petTypes,
  getPetCountByType,
  getPetTypeIcon,
  onCardClick,
  ...searchFilterProps
}: PetTypeGridWithSearchProps) {
  return (
    <div className="pet-type-grid-with-search">
      {/* 第一行：搜索组件 */}
      <div className="search-filter-row">
        <RecordSearchFilter
          {...searchFilterProps}
          className="top-search-filter"
        />
      </div>

      {/* 第二行：5个宠物类型卡片 */}
      <div className="pet-type-grid-row">
        {petTypes.map((type) => {
          const count = getPetCountByType(type.id);
          const iconPath = getPetTypeIcon(type.id);
          return (
            <Card
              key={type.id}
              className="pet-type-card"
              style={{
                background: type.gradient,
                cursor: 'pointer',
                height: '100%',
                width: '100%'
              }}
              onClick={() => onCardClick(type.path)}
            >
              <div className="pet-type-card-content">
                <div className="pet-type-icon-wrapper">
                  <img
                    src={iconPath}
                    alt={type.name}
                    className="pet-type-icon"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <h3 className="pet-type-name">{type.name}</h3>
                <p className="pet-type-description">{type.description}</p>
                <div className="pet-type-count">
                  <span className="count-number">{count}</span>
                  <span className="count-label">只宠物</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default PetTypeGridWithSearch;

