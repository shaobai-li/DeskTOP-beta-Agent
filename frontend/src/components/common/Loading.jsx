/**
 * Loading 组件 - 等待信息回复的加载动画
 * @param {Object} props
 * @param {string} [props.text='加载中'] - 加载文字
 * @param {string} [props.size='md'] - 尺寸：'sm' | 'md' | 'lg'
 * @param {string} [props.color='#3b82f6'] - 小球颜色（默认蓝色）
 * @param {string} [props.className] - 额外的样式类名
 */
export default function Loading({ text = '加载中', size = 'md', color = '#3b82f6', className = '' }) {
  // 根据尺寸设置小球大小和文字大小
  const sizeClasses = {
    sm: 'w-1 h-1',   // 6px
    md: 'w-1.5 h-1.5',       // 8px
    lg: 'w-2 h-2',       // 12px
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const paddingClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
  };

  const dotSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textSizeClasses[size] || textSizeClasses.md;
  const padding = paddingClasses[size] || paddingClasses.md;

  // 内联动画样式
  const dotStyle = (delay) => ({
    backgroundColor: color,
    animation: 'bounce-delay 1.4s infinite ease-in-out both',
    animationDelay: delay,
  });

  return (
    <>
      <style>{`
        @keyframes bounce-delay {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className={`inline-flex ${className}`}>
        <div 
          className={`flex items-center gap-2 ${padding} rounded-full`}
          style={{ backgroundColor: '#dbeafe' }}
        >
          <span className={`${textSize} font-medium`} style={{ color }}>{text}</span>
          <div className="flex items-center gap-1.5">
            <div className={`${dotSize} rounded-full`} style={dotStyle('-0.32s')} />
            <div className={`${dotSize} rounded-full`} style={dotStyle('-0.16s')} />
            <div className={`${dotSize} rounded-full`} style={dotStyle('0s')} />
          </div>
        </div>
      </div>
    </>
  );
}
