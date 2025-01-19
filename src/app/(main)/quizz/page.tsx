
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'
import Quizzhome from './_components/quizzComponentSample';


const page = async () => {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div>
            <Quizzhome />
        </div>
    )
}

export default page