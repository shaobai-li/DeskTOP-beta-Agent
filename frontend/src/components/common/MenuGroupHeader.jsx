import expandArrowIcon from '@assets/icon-ui-arrow-expand.png';

const MenuGroupHeader = ({ title, isOpen, onToggle }) => {
  return (
    <div
      className="
        menu-group-header
        flex items-center gap-[6px]
        mt-[30px] mx-[8px] mb-[4px] ml-[20px]
        cursor-pointer select-none text-[#aaa]
        group
      "
      onClick={onToggle}
    >
      <h4
        className="
          text-[#aaa] text-[inherit] font-normal m-0
          uppercase tracking-[0.5px]
        "
      >
        {title}
      </h4>

      <span
        className={`
          menu-group-header__icon
          w-[12px] h-[12px] bg-current
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200 ease
          ${isOpen ? "rotate-0" : "-rotate-90"}
        `}
        style={{
          WebkitMaskImage: `url(${expandArrowIcon})`,
          maskImage: `url(${expandArrowIcon})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  );
};

export default MenuGroupHeader;