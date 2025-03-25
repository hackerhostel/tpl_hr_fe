import React from 'react';
import Goal from "../../components/user-tables/Goal"
import Certification from "../../components/user-tables/Certification"
import FacebookCard from "../../components/user-tables/FeedbackCard"
import KPICard from "../../components/user-tables/KPIsCard"
import Competencies from "../../components/user-tables/Competencies"

const UserContent = () => {

    return (
        <div className='bg-slate-100 flex'>
            <div style={{ width: "60%" }}>
                <div className='pt-2'>
                    <Goal />
                </div>

                <div className='mt-2'>
                    <Certification />
                </div>
            </div>

            <div className='flex flex-col space-y-3 p-2' style={{width:"40%"}}>
                <div className=''>
                    <FacebookCard />
                </div>

                <div>
                    <KPICard />
                </div>

                <div>
                    <Competencies />
                </div>
            </div>





        </div>
    )

}

export default UserContent;