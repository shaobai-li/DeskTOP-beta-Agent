import moreIcon from '@assets/icon-ui-ellipsis-horizontal.png'

export default function MoreButton({ onClick }) {
    return (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-200" onClick={onClick}>
            <img src={moreIcon} alt="more" className="w-4 h-4" />
        </div>
    )
}