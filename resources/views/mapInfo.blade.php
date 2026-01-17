
<div dir="rtl" style="direction: rtl; width: 98%;">
    <table style="width: 100%; border-bottom: 1px solid;">
        <thead>
        <tr>
            <th colspan="4">آخر تعامل</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="width: 20%;">تاريخ:</td>
            <td style="width: 50%;">
                <span>{{ $item->lastDealDate }}</span>
                @if($item->DealCut == 1)
                    <span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>
                @elseif($item->DealCut == 2)
                    <span style="background-color: orange; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>
                @else
                    <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>
                @endif
                &nbsp;
                <span>{{ $item->sales_days }} يوم</span>
            </td>
        </tr>
        <tr>
            <td style="width: 20%;">موزع:</td>
            <td style="width: 50%;">{{ $item->lastDealSalesman }}</td>
            <td style="width: 15%;">قيمة:</td>
            <td style="width: 15%;">{{ number_format($item->lastDealSales) }}</td>
        </tr>
        </tbody>
    </table>

    <table style="width: 100%; border-bottom: 1px solid;">
        <thead>
        <tr>
            <th colspan="4">أكبر تعامل</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="width: 20%;">تاريخ:</td>
            <td style="width: 50%;">
                <span>{{ $item->MaxDealDate }}</span>
            </td>
        </tr>
        <tr>
            <td style="width: 20%;">موزع:</td>
            <td style="width: 50%;">{{ $item->MaxDealSalesman }}</td>
            <td style="width: 15%;">قيمة:</td>
            <td style="width: 15%;">{{ number_format($item->MaxDealSales) }}</td>
        </tr>
        </tbody>
    </table>

    <table style="width: 100%; border-bottom: 1px solid;">
        <thead>
        <tr>
            <th colspan="4">آخر زيارة</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="width: 20%;">تاريخ:</td>
            <td style="width: 50%;">
                <span>{{ $item->visit_date }}</span>
                @if($item->VisitCut == 1)
                    <span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>
                @else
                    <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>
                @endif
                &nbsp;
                <span>{{ $item->visit_days }} يوم</span>
            </td>
        </tr>
        <tr>
            <td style="width: 20%;">موزع:</td>
            <td style="width: 50%;">{{ $item->lastVisitSalesman }}</td>
            <td style="width: 15%;"></td>
            <td style="width: 15%;"></td>
        </tr>
        </tbody>
    </table>

    <table style="width: 100%; border-bottom: 1px solid;">
        <tbody>
        <tr>
            <td>وسطي الفاتورة</td>
            <td>{{ number_format($item->AVGSales) }}</td>
        </tr>
        </tbody>
    </table>

    @if($item->meta_xml)
        <table dir="rtl" style="width: 99%; margin-top: 1px;margin-bottom: 1px; border-bottom: 1px solid;">
            <tr>
                <th>السنة</th>
                <th>اجمالي المبيعات</th>
            </tr>
            @foreach($item->salesData->Row as $row)
                <tr>
                    <td style="text-align: center;">{{$row->Year}}</td>
                    <td style="text-align: center;">{{$row->Total}}</td>
                </tr>
            @endforeach
        </table>
    @endif

</div>


