import student from '../../../assets/icons/studentsMore.svg'

interface propType {
    text: string,
    count: number,
}

function CountCard({ count, text }: propType) {
    return (
        <div className="bg-white p-4 px-5 rounded-lg w-full flex items-center justify-between space-x-4 cursor-pointer border-2 border-transparent">
            <div className="flex items-center space-x-10">
                <img className="w-6" src={student} alt="" />
                <p className="font-medium text-ellipsis overflow-hidden text-nowrap w-full">{text}</p>
            </div>
            <p className="font-medium">{count}</p>
        </div>

    )
}

export default CountCard
