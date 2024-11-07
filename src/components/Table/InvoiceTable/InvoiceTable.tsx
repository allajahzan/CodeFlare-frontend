import { useSelector } from 'react-redux';
import Header from '../InvoiceTable/Header';
import Body from './Body';
import { stateType } from '../../../redux/store';

function InvoiceTable() {
    const isSmall = useSelector((state: stateType) => state.isSmall)
    return (
        <div className='overflow-x-auto h-full'>
            <div className='flex flex-col h-full' style={isSmall ? { minWidth: '1000px' } : {}}>
                {/* Table Rows */}
                <div className="flex-1 overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white">
                        <Header />
                    </div>
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((_, index) => (
                            <Body key={index} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceTable
