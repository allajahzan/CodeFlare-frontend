import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import DropDown from "../DropDowns/Counsellor/DropDown";

interface propsType {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

function LeaveModal({ openModal, setOpenModal }: propsType) {

    const [absenceTypes, setAbsenceTypes] = useState<string[]>([])
    const [leaveTypes, setLeaveTypes] = useState<string[]>([])
    const [partailAbsenceTypes, setPartialAbsenceTypes] = useState<string[]>([])
    const [selectedAbsenceType, setAbsenceType] = useState<string>('Abscence Type')
    const [selectedLeaveType, setLeaveType] = useState<string>('Leave Type')
    const [selectedPartialAbsenceType, setPartialAbsenceType] = useState<string>('Partial Abscence Type')
    const [isDropDown1Open, setDropDown1] = useState<boolean>(false)
    const [isDropDown2Open, setDropDown2] = useState<boolean>(false)
    const [isDropDown3Open, setDropDown3] = useState<boolean>(false)

    const onChangeSelect1 = (text: string) => {
        setAbsenceType(text)
        setDropDown1(false)
        setLeaveType('Leave Type')
        setPartialAbsenceType('Partial Abscence Type')
    }

    const onChangeSelect2 = (text: string) => {
        setLeaveType(text)
        setDropDown2(false)
    }

    const onChangeSelect3 = (text: string) => {
        setPartialAbsenceType(text)
        setDropDown3(false)
    }

    const handleCloseModa = () => {
        setOpenModal(!openModal)
        setAbsenceType('Abscence Type')
        setLeaveType('Leave Type')
        setPartialAbsenceType('Partial Abscence Type')
        setDropDown1(false)
        setDropDown2(false)
        setDropDown3(false)
    }

    useEffect(() => {
        setAbsenceTypes(['Partial Absence', 'Leave'])
        setPartialAbsenceTypes(['Late Coming', 'Early Leaving'])
        setLeaveTypes(['Half Day', 'Full Day'])
    }, [])

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
                        <h1 className="text-lg text-black font-extrabold uppercase tracking-wider">Apply Leave</h1>
                        <form className="flex flex-col gap-4 w-full" action="">
                            <DropDown datas={absenceTypes} selectedItem={selectedAbsenceType} setStateVariable1={setDropDown1} setStateVariable2={setDropDown2} setStateVariable3={setDropDown3} stateVariable={isDropDown1Open} handleFunction={onChangeSelect1} />
                            {selectedAbsenceType === 'Leave' ? <DropDown datas={leaveTypes} selectedItem={selectedLeaveType} setStateVariable1={setDropDown2} stateVariable={isDropDown2Open} handleFunction={onChangeSelect2} /> : ''}
                            {selectedAbsenceType === 'Partial Absence' ? <DropDown datas={partailAbsenceTypes} selectedItem={selectedPartialAbsenceType} setStateVariable1={setDropDown3} stateVariable={isDropDown3Open} handleFunction={onChangeSelect3} /> : ''}
                            <input name="field4" className="p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-10 font-medium rounded-lg outline-none cursor-pointer" type="date" required />
                            <div className="relative w-full">
                                <textarea id="reason" className="block p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-10 font-medium rounded-lg outline-none w-full resize-none" rows={5} required></textarea>
                                <label htmlFor="reason" className="absolute -top-2 left-2 bg-white text-gray-500 text-xs font-extrabold px-2">Reason</label>
                            </div>
                            <div className="w-full flex gap-2 justify-center">
                                <button onClick={handleCloseModa} className="p-2 py-2 px-8 rounded-md bg-gray-200 text-black font-extrabold tracking-wider uppercase">Cancel</button>
                                <button type={'submit'} className="p-2 py-2 px-8 rounded-md bg-black text-white shadow-lg font-extrabold tracking-wider uppercase">Submit</button>
                            </div>
                        </form>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default LeaveModal