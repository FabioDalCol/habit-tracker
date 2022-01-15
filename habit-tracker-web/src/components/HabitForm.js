import React from 'react';
import { useForm } from 'react-hook-form';
import './HabitForm.css'
import { getDate, addHabit } from '../Api'
import Checkbox from '@mui/material/Checkbox';

export default function HabitForm({ uid, token }) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const makeHabit = (data) => {
        var habit = {
            name: data.Category == 'Custom' ? data.HabitName : data.Category,
            desc: data.Category == 'Custom' ? data.Description : 'Default Habit',
            category: data.Category,
            created: getDate(),
            repeat_days: {
                Thu: data.Thu,
                Fri: data.Fri,
                Sat: data.Sat,
                Wed: data.Wed,
                Sun: data.Sun,
                Tue: data.Tue,
                Mon: data.Mon
            },
            countable: data.Category != 'Custom',
            reminder: data.Reminder ? data.Times : 0,
            is_active: true,
        };
        if (data.Category != "Custom") {
            habit['value'] = 0;
            habit['set_value'] = data.Category == "Drink" ? data.Glasses : data.Steps
        }
        return habit;
    }


    const onSubmit = data => addHabit(uid, token, makeHabit(data)); //richiama api create
    const reminder = watch("Reminder");
    const category = watch("Category")
    const defaultValues = {
        glasses: 10,
        steps: 10000,
    }

    const renderForm = () => {
        return (<>
            <div className='days'>
                <div className='checky'>
                    <label>Mon</label>
                    <Checkbox  {...register("Mon")} />
                </div>
                <div className='checky'>
                    <label>Tue</label>
                    <Checkbox {...register("Tue")} />
                </div>
                <div className='checky'>
                    <label>Wed</label>
                    <Checkbox {...register("Wed")} />
                </div>
                <div className='checky'>
                    <label>Thu</label>
                    <Checkbox {...register("Thu")} />
                </div>
                <div className='checky'>
                    <label>Fri</label>
                    <Checkbox {...register("Fri")} />
                </div>
                <div className='checky'>
                    <label>Sat</label>
                    <Checkbox {...register("Sat")} />
                </div>
                <div className='checky'>
                    <label>Sun</label>
                    <Checkbox {...register("Sun")} />
                </div>
            </div>
            <div className='optional'>
                <div className='checky'>
                    <label>Reminder</label>
                    <Checkbox {...register("Reminder")} />
                </div>
                {reminder && (
                    <div className='checky'>
                        <label style={{marginTop:-8}}>Times</label>
                        <select style={{marginTop:8}} {...register("Times")}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                )}
            </div>
            <input type="submit" value="Send" /></>)
    }



    return (
        <form className='habit-form' onSubmit={handleSubmit(onSubmit)}>
            <select {...register("Category", { required: true })}>
                <option value="Custom">Custom</option>
                <option value="Drink">Drink</option>
                <option value="Walk">Walk</option>
            </select>

            {category == "Custom" && (<>
                <input type="text" placeholder="Habit name" {...register("HabitName", { required: true, maxLength: 80 })} />
                <input type="text" placeholder="Description" {...register("Description", { required: true, maxLength: 100 })} />
                {renderForm()}
            </>)}

            {category == "Drink" && (<>
                <div className='numbox'>
                    <label className='labello'>Daily glasses</label>
                    <input type="number" defaultValue={defaultValues.glasses} {...register("Glasses", { required: true, max: 99 })} />
                </div>
                {renderForm()}
            </>)}

            {category == "Walk" && (<>
                <div className='numbox'>
                    <label className='labello'>Daily steps</label>
                    <input type="number" defaultValue={defaultValues.steps} {...register("Steps", { required: true, max: 500000 })} />
                </div>
                {renderForm()}
            </>)}
        </form>
    );
}