import { Modal } from "flowbite-react";
import { useState } from "react";

interface propsType {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

function LeaveModal({ openModal, setOpenModal }: propsType) {

    const [leaveType, setLeaveType] = useState<string>('')
    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLeaveType(event.target.value)
    }

    return (
        <>
            <Modal size="xl" theme={{
                "root": {
                    "base": "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
                    "show": {
                        "on": "flex bg-black bg-opacity-50",
                        "off": "hidden"
                    },
                    "sizes": {
                        "sm": "max-w-sm",

                    },
                },
                "content": {
                    "base": "relative w-full p-4",
                    "inner": "relative flex max-h-[90dvh] flex-col rounded-md bg-white"
                },
            }} show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Body>
                    <div className="space-y-6 flex flex-col items-center justify-center">
                        <h1 className="text-lg text-black font-medium uppercase tracking-wider">Apply Leave</h1>
                        <form className="flex flex-col gap-4 w-full" action="">
                            <select name="field1" onChange={onChangeSelect} className="p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none cursor-pointer" required>
                                <option value="" hidden>Abscence Type</option>
                                <option value="Partial Absence">Partial Absence</option>
                                <option value="Leave">Leave</option>
                            </select>
                            {leaveType === 'Partial Absence' ? <select name="field2" className="p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none cursor-pointer" required>
                                <option value="" hidden>Partial Abscence Type</option>
                                <option value="">Late Coming</option>
                                <option value="">Early Leaving</option>
                            </select> : ''}
                            {leaveType === 'Leave' ? <select name="field3" className="p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none cursor-pointer" required>
                                <option value="" hidden>Leave Type</option>
                                <option value="">Half Day</option>
                                <option value="">Full Day</option>
                            </select> : ''}
                            <input name="field4" className="p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none cursor-pointer" type="date" required />
                            <div className="relative w-full">
                                <textarea id="reason" className="block p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none w-full text-base resize-none" rows={5} required></textarea>
                                <label htmlFor="reason" className="absolute -top-2 left-2 bg-white text-gray-500 text-xs font-medium px-2">Reason</label>
                            </div>
                            <div className="w-full flex gap-2 justify-center">
                                <button onClick={() => { setOpenModal(!openModal); setLeaveType('') }} className="p-2 py-2 px-8 rounded-md bg-gray-200 text-black font-medium">Cancel</button>
                                <button type={'submit'} className="p-2 py-2 px-8 rounded-md bg-black text-white shadow-lg font-medium">Submit</button>
                            </div>
                        </form>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default LeaveModal