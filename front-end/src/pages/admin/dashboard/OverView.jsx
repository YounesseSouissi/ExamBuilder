import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function Overview({ counts }) {

    const primaryColor = "hsl(var(--primary))";

    const data = [
        {
            name: 'users',
            total: counts.users
        },
        {
            name: 'modules',
            total: counts.modules
        },
        {
            name: 'chapitres',
            total: counts.chapitres
        },
        {
            name: 'questions',
            total: counts.questions
        },
        {
            name: 'reponses',
            total: counts.reponses
        },
    ];

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}