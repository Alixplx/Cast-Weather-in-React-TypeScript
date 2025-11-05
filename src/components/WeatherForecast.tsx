import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";


interface WeatherForecastProps {

    data: ForecastData;
}

interface DailyForecast {

    date: number
    temp_min: number
    temp_max: number
    humidity: number
    wind: number
    weather : {

        id: number
        main: string
        description: string
        icon: string
    }
}

const WeatherForecast = ({ data}: WeatherForecastProps) => {
  
    const dailyForecasts = data.list.reduce((accu, forecast) => {

        const date = format(new Date(forecast.dt * 1000), "yyyy-mm-dd")

        if (!accu[date]) {

            accu[date] = {

                temp_min: forecast.main.temp_min,
                temp_max: forecast.main.temp_max,
                humidity: forecast.main.humidity,
                wind: forecast.wind.speed,
                weather: forecast.weather[0],
                date: forecast.dt,
            }

        } else {

            accu[date].temp_min = Math.min(accu[date].temp_min, forecast.main.temp_min)
            accu[date].temp_max = Math.max(accu[date].temp_max, forecast.main.temp_max)
        }

        return accu

    }, {} as Record<string, DailyForecast>)

    const nextDays = Object.values(dailyForecasts).slice(0, 6)

    const formatTemp = (temp: number) => `${Math.round(temp)}°`

    return (
        
        
        <Card>

            <CardHeader>

                <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>

            <CardContent>

                <div className="grid gap-4">

                    {
                        nextDays.map((nextDay) => {

                            return <div key={nextDay.date} className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4">

                                <div>

                                    <p className="font-medium mb-2">{format(new Date(nextDay.date * 1000), "EEE, MMM d")}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{nextDay.weather.description}</p>
                                </div>

                                <div className="flex justify-center gap-4">

                                    <span className="flex items-center text-blue-500">

                                        <ArrowDown className="mr-1 h-4 w-4" />
                                        {formatTemp(nextDay.temp_min)}
                                    </span>
                                    <span className="flex items-center text-red-500">

                                        <ArrowUp className="mr-1 h-4 w-4" />
                                        {formatTemp(nextDay.temp_max)}
                                    </span>
                                </div>
                                
                                <div className="flex justify-end gap-4">

                                    <span className="flex items-center gap-1">

                                        <Droplets className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm">{nextDay.humidity}%</span>
                                    </span>
                                    <span className="flex items-center gap-1">

                                        <Wind className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm">{nextDay.wind}m/s</span>
                                    </span>
                                </div>
                            </div>
                        })
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherForecast