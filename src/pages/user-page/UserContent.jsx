import React from 'react';
import Goal from "../../components/user-tables/Goal"
import Certification from "../../components/user-tables/Certification"
import FacebookCard from "../../components/user-tables/FeedbackCard"
import KPICard from "../../components/user-tables/KPIsCard"

const UserContent = () => {

    return (
        <div className='bg-slate-100 flex'> 
            <div style={{width:"62%"}}>
                <div className='pt-2'>
                    <Goal />
                </div>

                <div className='mt-2'>
                    <Certification />
                </div>
            </div>

            <div>
            <div className='p-2'>
                <FacebookCard />
            </div>

            <div>
                <KPICard/>
            </div>
            </div>

            



        </div>
    )

}

export default UserContent;