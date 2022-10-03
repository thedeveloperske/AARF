import CancelReinstateMemberForm from "./CancelReinstateMemberForm";

const CancelMember = () => {
    return (
        <div>
            <CancelReinstateMemberForm
                header="Cancel Client" module="cancel"
                action_button={"Cancel"} reason={"Cancellation Reason: "}
                date={"Cancellation Date: "}/>
        </div>
    )
}
export default CancelMember;