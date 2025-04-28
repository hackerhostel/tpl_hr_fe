import React from 'react';
import Goal from "../../components/user-tables/Goal"
import Certification from "../../components/user-tables/Certification"
import FeedBackCard from "../../components/user-tables/FeedbackCard"
import Competencies from "../../components/user-tables/Competencies"
import Kpi from "../../components/user-tables/Kpi"

const UserContent = () => {

    return (
        <div className='bg-slate-100 flex flex-col'>
            <div className='flex p-5 space-x-3'>
                <div className='w-96'>
                <FeedBackCard />
                </div>

                <div className='w-96'>
                <Kpi />
                </div>

                <div className='w-96'>
                <Competencies />
                </div>

            </div>

            <div className='p-5'>
                <div className=''>
                    <Goal />
                </div>

                <div className='mt-2'>
                    <Certification />
                </div>
            </div>

            {/* <div className='flex flex-col space-y-3 p-2' style={{width:"40%"}}>
                <div className=''>
                    <FacebookCard />
                </div>

                <div>
                    <KPICard />
                </div>

                <div>
                    <Competencies />
                </div>
            </div> */}





        </div>
    )

}

export default UserContent;