// src/components/ScrollImageGallery.tsx

import React, { useState, useEffect } from 'react';
import './ScrollImageGallery.css';

const ScrollImageGallery: React.FC = () => {
  // 所有动物SVG图片资源（前3张用于引导，全部可用于全屏）
  const allImages = [
    // 引导阶段图片（竖屏）
    '/images/svg/puppy.svg', // 小狗 - 竖屏
    '/images/svg/lion.svg', // 狮子 - 竖屏
    '/images/svg/elephant.svg', // 大象 - 竖屏
    
    // 全屏展示图片（横屏）
    '/images/svg/panda_large.svg', // 熊猫 - 横屏
    '/images/svg/lion_large.svg', // 狮子 - 横屏
    '/images/svg/elephant_large.svg', // 大象 - 横屏
    '/images/svg/tiger_large.svg', // 老虎 - 横屏
  ];

  const [scrollY, setScrollY] = useState(0);
  const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState(0);

  // 滚动阈值（单位：px）
  const GUIDE_END_SCROLL = 600; // 引导阶段结束的 scrollY
  const FULLSCREEN_SECTION_HEIGHT = 800; // 每张全屏图占 800px 滚动高度

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      if (y >= GUIDE_END_SCROLL) {
        const index = Math.min(
          Math.floor((y - GUIDE_END_SCROLL) / FULLSCREEN_SECTION_HEIGHT),
          allImages.length - 1
        );
        setCurrentFullscreenIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 判断是否已进入全屏阶段
  const isInFullscreenMode = scrollY >= GUIDE_END_SCROLL;

  // 计算引导阶段的缩放比例（0 ~ 1）
  const guideProgress = Math.min(scrollY / GUIDE_END_SCROLL, 1);
  const baseScale = 1 + guideProgress * 0.8; // 最大放大到 1.8 倍

  return (
    <>
      {/* 引导内容区（始终在文档流中） */}
     

        {!isInFullscreenMode && (
          <div className="image-guide">
            {allImages.slice(0, 3).map((src, idx) => {
              const animalNames = ['小狗', '狮子', '大象'];
              return (
                <div
                  key={idx}
                  className={`guide-image image-${idx + 1}`}
                  style={{
                    transform: `scale(${baseScale})`,
                    opacity: 1 - guideProgress * 0.7,
                    zIndex: 3 - idx,
                  }}
                >
                  <img src={src} alt={`${animalNames[idx]} - 引导图片 ${idx + 1}`} />
                </div>
              );
            })}
          </div>
        )}
     

      {/* 全屏图片覆盖层（固定定位，高 z-index） */}
      {isInFullscreenMode && (
        <div className="fullscreen-overlay">
          <img
            src={allImages[currentFullscreenIndex]}
            alt={`动物展示 ${currentFullscreenIndex + 1}`}
            className="fullscreen-image"
          />
          {/* 可选：添加指示器 */}
          <div className="indicator">
            {currentFullscreenIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

      {/* 占位元素，确保页面可滚动 */}
      <div style={{ height: `${GUIDE_END_SCROLL + allImages.length * FULLSCREEN_SECTION_HEIGHT}px` }} />
    </>
  );
};

export default ScrollImageGallery;