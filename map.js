const data = [
    {
        name: '수범',
        gender: '남자',
        music: [
            {
                name: '엘리제'
            },
            {
                name: 'summber'
            }
        ]
    }
];

const result = data.map((p) => {
    return p.music.map((a) => {
        console.log(p);
        console.log(a);
    });
});
