<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

<table>
    <thead>
    <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    @foreach($final_res as $re)
    <tr>
        <td>{{$re['customer_id']}}</td>
        <td>{{$re['customer_name']}}</td>
        <td>{{$re['salesman_code']}}</td>
        <td>{{$re['visit_date']}}</td>
        <td>{{$re['latitude']}}</td>
        <td>{{$re['longitude']}}</td>
        <td>{{$re['google_distance']}}</td>
    </tr>
    @endforeach
    </tbody>
</table>


</body>
</html>