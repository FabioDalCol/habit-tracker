import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './HabitForm.css'
import { getDate, addHabit } from '../Api'
import Checkbox from '@mui/material/Checkbox';
import toast from 'react-hot-toast';

export default function HabitForm({ uid, token }) {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const daysString = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [days, setDays] = useState({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, Reminder: false, Eve: false });

    //Create and return a habit to pass to db
    const makeHabit = (data) => {
        var habit = {
            name: data.Category == 'Custom' ? data.HabitName : data.Category,
            desc: pickDescription(data),
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
            value: 0,
        };
        if (data.Category != "Custom") {
            habit['set_value'] = data.Category == "Drink" ? data.Glasses : data.Steps
        }
        return habit;
    }

    const pickDescription = (newHabitForm) => {
        switch (newHabitForm.Category) {
            case "Custom":
                return newHabitForm.Description;
            case "Drink":
                return "Stay hydrated";
            case "Walk":
                return "Get fit";
        }
    }

    const category = watch("Category")
    const defaultValues = {
        glasses: 10,
        steps: 10000,
    }

    //call api create habit and reset the form
    const onSubmit = data => {
        addHabit(uid, token, makeHabit(data))
            .then(() => {
                toast('Habit added !');
                reset();
                setDays({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, Reminder: false });
            });
    }

    const renderForm = () => {
        return (<>
            <div className='days'>
                <div className='checky'>
                    <label>Mon</label>
                    <Checkbox
                        checked={days.Mon}
                        onClick={() => setDays({ ...days, Mon: !days.Mon })}
                        {...register("Mon")} />
                </div>
                <div className='checky'>
                    <label>Tue</label>
                    <Checkbox
                        checked={days.Tue}
                        onClick={() => setDays({ ...days, Tue: !days.Tue })}
                        {...register("Tue")} />
                </div>
                <div className='checky'>
                    <label>Wed</label>
                    <Checkbox
                        checked={days.Wed}
                        onClick={() => setDays({ ...days, Wed: !days.Wed })}
                        {...register("Wed")} />
                </div>
                <div className='checky'>
                    <label>Thu</label>
                    <Checkbox
                        checked={days.Thu}
                        onClick={() => setDays({ ...days, Thu: !days.Thu })}
                        {...register("Thu")} />
                </div>
                <div className='checky'>
                    <label>Fri</label>
                    <Checkbox
                        checked={days.Fri}
                        onClick={() => setDays({ ...days, Fri: !days.Fri })}
                        {...register("Fri")} />
                </div>
                <div className='checky'>
                    <label>Sat</label>
                    <Checkbox
                        checked={days.Sat}
                        onClick={() => setDays({ ...days, Sat: !days.Sat })}
                        {...register("Sat")} />
                </div>
                <div className='checky'>
                    <label>Sun</label>
                    <Checkbox
                        checked={days.Sun}
                        onClick={() => setDays({ ...days, Sun: !days.Sun })}
                        {...register("Sun")} />
                </div>
            </div>
            <div className='checky'>
                <label>Everyday</label>
                <Checkbox
                    checked={days.Eve}
                    onClick={() => {
                        let diz = {};
                        for (var key of daysString) {
                            diz[key] = !days['Eve'];
                        }
                        setDays({ ...days, ...diz, Eve: !days['Eve'] });
                    }}
                />
            </div>

            <div className='optional'>
                <div className='checky'>
                    <label>Reminder</label>
                    <Checkbox
                        checked={days.Reminder}
                        onClick={() => setDays({ ...days, Reminder: !days.Reminder })}
                        {...register("Reminder")} />
                </div>
                {days.Reminder && (
                    <div className='checky'>
                        <label style={{ marginTop: -8 }}>Times</label>
                        <select style={{ marginTop: 8 }} {...register("Times")}>
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

            {category == "Walk" ? (<>
                <div className='numbox'>
                    <label className='labello'>Daily steps</label>
                    <input type="number" defaultValue={defaultValues.steps} {...register("Steps", { required: true, max: 500000 })} />
                    {errors.Steps?.type === 'required' && <p style={{ color: 'red' }}>Target is required</p>}
                </div>
            </>)
                :
                category == "Drink" ? (<>
                    <div className='numbox'>
                        <label className='labello'>Daily glasses</label>
                        <input type="number" defaultValue={defaultValues.glasses} {...register("Glasses", { required: true, max: 99 })} />
                        {errors.Glasses?.type === 'required' && <p style={{ color: 'red' }}>Target is required</p>}
                    </div>
                </>)
                    :
                    (<>
                        <input type="text" placeholder="Habit name" {...register("HabitName", { required: true, maxLength: 80 })} />
                        {errors.HabitName?.type === 'required' && <p style={{ color: 'red' }}>Habit name is required</p>}
                        <input type="text" placeholder="Description" {...register("Description", { required: true, maxLength: 100 })} />
                        {errors.Description?.type === 'required' && <p style={{ color: 'red' }}>Description is required</p>}
                    </>)}
            {renderForm()}
        </form>
    );
}