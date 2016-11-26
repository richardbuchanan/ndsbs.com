<?php
require('fpdf_protection.php');

$pdf=new FPDF_Protection();

$pdf->SetProtection(array('print'), 'krishna');

$pdf->AddPage();
$pdf->SetFont('Arial');
$pdf->SetFontSize(10);

$pdf->SetFillColor(30, 144, 255);
$pdf->SetDrawColor(30, 144, 255);



$pdf->Image('logo.png', 158, 8, 40, 15);

//$pdf->Image('bg.png', 7, 80, 200, 200);


/////////////////////////////////////////////////////////////////   CONTENT HERE
$pdf->Write(
        4,
date("M d, Y") . '



Columbus, OH 43215

Re: Substance Abuse Assessment for  

Dear Mr. :

I performed a basic substance abuse assessment for _______ in reference to ___ pending reckless operation case. This assessment included the administration of: an AUDIT, a MAST, a depression screening, and a clinical interview. The following are my findings and recommendations:

Substance(s) of Concern:    
AUDIT: substance dependence = NEGATIVE; substance abuse = 
MAST: score= ___; indicates 
DSM/Other Substance Related Concerns: 
Depression/Anxiety Screening: 

Clinical Interview/Summary: 

DIAGNOSIS in reference to substances:  

Recommendations:  I have no further professional recommendations for __________ at this time. If she incurs any impaired driving charges in the future I recommend she seek additional evaluation. 

M__________ has signed a release to communicate the results of this assessment to you. Feel free to contact me should you have any questions about this assessment. 

Sincerely,



Brian Davis, LISW-S, SAP
cc: 

        ');
/////////////////////////////////////////////////////////////////   CONTENT HERE


$pdf->Image('sign.png', 7, 135, 30, 8);

$pdf->Output('NEW.pdf');
?>