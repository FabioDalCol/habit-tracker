import React from 'react';
import { useForm } from 'react-hook-form';
import './HabitForm.css'

export default function App() {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data); //richiama api create
    console.log(errors);
    const reminder = watch("Reminder");
    const everyday = watch("Eve");
    const mon = watch("Mon");
    const tue = watch("Tue");
    const wed = watch("Wed");
    const thu = watch("Thu");
    const fri = watch("Fri");
    const sat = watch("Sat");
    const sun = watch("Sun");
    const category = watch("Category")
    const defaultValues={
        glasses:10,
        steps:10000,
    }

  

    return (
        <form className='habit-form' onSubmit={handleSubmit(onSubmit)}>
            <select {...register("Category", { required: true })}>
                <option value="Custom">Custom</option>
                <option value="Drink">Drink</option>
                <option value="Walk">Walk</option>
            </select>

            {category=="Custom" &&(<>
                    <input type="text" placeholder="Habit name" {...register("Habit name", { required: true, maxLength: 80 })} />
                    <input type="text" placeholder="Description" {...register("Description", { required: true, maxLength: 100 })} />
                    <div className='days'>
                        <div className='checky'>
                            <label>Mon</label>
                            <input type="checkbox" {...register("Mon")} />
                        </div>
                        <div className='checky'>
                            <label>Tue</label>
                            <input type="checkbox" {...register("Tue")} />
                        </div>
                        <div className='checky'>
                            <label>Wed</label>
                            <input type="checkbox" {...register("Wed")} />
                        </div>
                        <div className='checky'>
                            <label>Thu</label>
                            <input type="checkbox" {...register("Thu")} />
                        </div>
                        <div className='checky'>
                            <label>Fri</label>
                            <input type="checkbox" {...register("Fri")} />
                        </div>
                        <div className='checky'>
                            <label>Sat</label>
                            <input type="checkbox" {...register("Sat")} />
                        </div>
                        <div className='checky'>
                            <label>Sun</label>
                            <input type="checkbox" {...register("Sun")} />
                        </div>
                    </div>

                    <div className='eve'>
                        <label>Everyday</label>
                        <input type="checkbox" {...register("Eve")} />
                    </div>
                    <div className='optional'>
                        <div className='checky'>
                            <label>Reminder</label>
                            <input type="checkbox" {...register("Reminder")} />
                        </div>
                        {reminder && (
                            <div className='checky'>
                                <label>Times</label>
                                <select {...register}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                        )}

                    </div>

                    <input type="submit" value="Send" />
                    <input
                    type="reset"
                    value="Clear Field"
                    />
                </>)}

                {category=="Drink" && (<>
                    <div className='numbox'>
                        <label className='labello'>Daily glasses</label>
                        <input type="number" defaultValue={defaultValues.glasses} {...register("Glasses", { max: 99 })} />
                    </div>
                    <div className='days'>
                        <div className='checky'>
                            <label>Mon</label>
                            <input type="checkbox" {...register("Mon")} />
                        </div>
                        <div className='checky'>
                            <label>Tue</label>
                            <input type="checkbox" {...register("Tue")} />
                        </div>
                        <div className='checky'>
                            <label>Wed</label>
                            <input type="checkbox" {...register("Wed")} />
                        </div>
                        <div className='checky'>
                            <label>Thu</label>
                            <input type="checkbox" {...register("Thu")} />
                        </div>
                        <div className='checky'>
                            <label>Fri</label>
                            <input type="checkbox" {...register("Fri")} />
                        </div>
                        <div className='checky'>
                            <label>Sat</label>
                            <input type="checkbox" {...register("Sat")} />
                        </div>
                        <div className='checky'>
                            <label>Sun</label>
                            <input type="checkbox" {...register("Sun")} />
                        </div>
                    </div>

                    <div className='eve'>
                        <label>Everyday</label>
                        <input type="checkbox" {...register("Eve")} />
                    </div>
                    <div className='optional'>
                        <div className='checky'>
                            <label>Reminder</label>
                            <input type="checkbox" {...register("Reminder")} />
                        </div>
                        {reminder && (
                            <div className='checky'>
                                <label>Times</label>
                                <select {...register}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                        )}

                    </div>

                    <input type="submit" value="Send" />
                    <input
                    type="reset"
                    value="Clear Field"
                    />
                </>)}

            {category=="Walk" &&(<>
                    <div className='numbox'>
                        <label className='labello'>Daily steps</label>
                        <input type="number" defaultValue={defaultValues.steps} {...register("Steps", { max: 500000 })} />
                    </div>
                    <div className='days'>
                        <div className='checky'>
                            <label>Mon</label>
                            <input type="checkbox" {...register("Mon")} />
                        </div>
                        <div className='checky'>
                            <label>Tue</label>
                            <input type="checkbox" {...register("Tue")} />
                        </div>
                        <div className='checky'>
                            <label>Wed</label>
                            <input type="checkbox" {...register("Wed")} />
                        </div>
                        <div className='checky'>
                            <label>Thu</label>
                            <input type="checkbox" {...register("Thu")} />
                        </div>
                        <div className='checky'>
                            <label>Fri</label>
                            <input type="checkbox" {...register("Fri")} />
                        </div>
                        <div className='checky'>
                            <label>Sat</label>
                            <input type="checkbox" {...register("Sat")} />
                        </div>
                        <div className='checky'>
                            <label>Sun</label>
                            <input type="checkbox" {...register("Sun")} />
                        </div>
                    </div>

                    <div className='eve'>
                        <label>Everyday</label>
                        <input type="checkbox" {...register("Eve")} />
                    </div>
                    <div className='optional'>
                        <div className='checky'>
                            <label>Reminder</label>
                            <input type="checkbox" {...register("Reminder")} />
                        </div>
                        {reminder && (
                            <div className='checky'>
                                <label>Times</label>
                                <select {...register}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <input type="submit" value="Send" />
                    <input
                    type="reset"
                    value="Clear Field"
                    />
                </>)}
        </form>
    );
}