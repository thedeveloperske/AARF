import CancelReinstateMemberForm from "./CancelReinstateMemberForm";

const ReinstateMember = () => {
    return (
        <div>
            <CancelReinstateMemberForm header="Reinstate Client" module="reinstate"
                                       action_button={"Reinsate"} reason={"Reinstate Reason: "}
                                       date={"Reinstate Date: "}/>
        </div>
    )
}
export default ReinstateMember;