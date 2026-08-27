!
{C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Services\JwtTokenGenerator.cs
	namespace

 	
Taskify


 
.

 
API

 
.

 
Services

 
;

 
public 
class 
JwtTokenGenerator 
:  
IJwtTokenGenerator! 3
{ 
private 
readonly 
JwtSettings  
_jwtSettings! -
;- .
public 

JwtTokenGenerator 
( 
IOptions %
<% &
JwtSettings& 1
>1 2
jwtSettings3 >
)> ?
{ 
_jwtSettings 
= 
jwtSettings "
." #
Value# (
;( )
} 
public 

( 
string 
Token 
, 
DateTime "
	ExpiresAt# ,
), -
GenerateToken. ;
(; <
User 
user 
, 
Guid 
tokenId 
) 
{ 
var 
	expiresAt 
= 
DateTime  
.  !
UtcNow! '
.' (

AddMinutes( 2
(2 3
_jwtSettings 
. 
ExpirationMinutes *
)* +
;+ ,
var 
claims 
= 
new 
List 
< 
Claim #
># $
{ 	
new 
( #
JwtRegisteredClaimNames '
.' (
Sub( +
,+ ,
user- 1
.1 2
Id2 4
.4 5
ToString5 =
(= >
)> ?
)? @
,@ A
new 
( #
JwtRegisteredClaimNames '
.' (
Email( -
,- .
user/ 3
.3 4
Email4 9
)9 :
,: ;
new   
(   

ClaimTypes   
.   
Name   
,    
$"  ! #
{  # $
user  $ (
.  ( )
	FirstName  ) 2
}  2 3
$str  3 4
{  4 5
user  5 9
.  9 :
LastName  : B
}  B C
"  C D
)  D E
,  E F
new!! 
(!! 

ClaimTypes!! 
.!! 
Role!! 
,!!  
user!!! %
.!!% &
Role!!& *
.!!* +
ToString!!+ 3
(!!3 4
)!!4 5
)!!5 6
,!!6 7
new"" 
("" #
JwtRegisteredClaimNames"" '
.""' (
Jti""( +
,""+ ,
tokenId""- 4
.""4 5
ToString""5 =
(""= >
)""> ?
)""? @
}## 	
;##	 

var%% 
key%% 
=%% 
new%%  
SymmetricSecurityKey%% *
(%%* +
Encoding&& 
.&& 
UTF8&& 
.&& 
GetBytes&& "
(&&" #
_jwtSettings&&# /
.&&/ 0
	SecretKey&&0 9
)&&9 :
)&&: ;
;&&; <
var(( 
credentials(( 
=(( 
new(( 
SigningCredentials(( 0
(((0 1
key)) 
,)) 
SecurityAlgorithms** 
.** 

HmacSha256** )
)**) *
;*** +
var,, 
token,, 
=,, 
new,, 
JwtSecurityToken,, (
(,,( )
issuer-- 
:-- 
_jwtSettings--  
.--  !
Issuer--! '
,--' (
audience.. 
:.. 
_jwtSettings.. "
..." #
Audience..# +
,..+ ,
claims// 
:// 
claims// 
,// 
expires00 
:00 
	expiresAt00 
,00 
signingCredentials11 
:11 
credentials11  +
)11+ ,
;11, -
return33 
(33 
new44 #
JwtSecurityTokenHandler44 '
(44' (
)44( )
.44) *

WriteToken44* 4
(444 5
token445 :
)44: ;
,44; <
	expiresAt55 
)66 	
;66	 

}77 
}88 ¿K
hC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Program.cs
Log 
. 
Logger 

= 
new 
LoggerConfiguration $
($ %
)% &
. 
MinimumLevel 
. 
Information 
( 
) 
. 
WriteTo 
. 
Console 
( 
) 
. 
WriteTo 
. 
File 
( 
$str 
, 
rollingInterval 
: 
RollingInterval (
.( )
Day) ,
,, -"
retainedFileCountLimit 
: 
$num  "
)" #
. 
CreateLogger 
( 
) 
; 
try 
{ 
var 
builder 
= 
WebApplication  
.  !
CreateBuilder! .
(. /
args/ 3
)3 4
;4 5
builder"" 
."" 
Host"" 
."" 

UseSerilog"" 
("" 
)"" 
;"" 
builder%% 
.%% 
Services%% 
.%% 
AddDbContext%% !
<%%! "
TaskifyDbContext%%" 2
>%%2 3
(%%3 4
options%%4 ;
=>%%< >
options&& 
.&& 
UseSqlServer&& 
(&& 
builder'' 
.'' 
Configuration'' !
.''! "
GetConnectionString''" 5
(''5 6
$str''6 I
)''I J
)''J K
)''K L
;''L M
builder** 
.** 
Services** 
.** 
	AddScoped** 
<** 
IUserRepository** .
,**. /
UserRepository**0 >
>**> ?
(**? @
)**@ A
;**A B
builder++ 
.++ 
Services++ 
.++ 
	AddScoped++ 
<++ "
IUserSessionRepository++ 5
,++5 6!
UserSessionRepository++7 L
>++L M
(++M N
)++N O
;++O P
builder,, 
.,, 
Services,, 
.,, 
	AddScoped,, 
<,, 
ITaskRepository,, .
,,,. /
TaskRepository,,0 >
>,,> ?
(,,? @
),,@ A
;,,A B
builder// 
.// 
Services// 
.// 
	Configure// 
<// 
JwtSettings// *
>//* +
(//+ ,
builder00 
.00 
Configuration00 
.00 

GetSection00 (
(00( )
$str00) 6
)006 7
)007 8
;008 9
builder33 
.33 
Services33 
.33 /
#AddValidatorsFromAssemblyContaining33 8
<338 9$
RegisterRequestValidator44  
>44  !
(44! "
)44" #
;44# $
builder77 
.77 
Services77 
.77 
	AddScoped77 
<77 
IJwtTokenGenerator77 1
,771 2
JwtTokenGenerator773 D
>77D E
(77E F
)77F G
;77G H
builder88 
.88 
Services88 
.88 
	AddScoped88 
<88 
IPasswordHasher88 .
<88. /
User88/ 3
>883 4
,884 5
PasswordHasher886 D
<88D E
User88E I
>88I J
>88J K
(88K L
)88L M
;88M N
builder99 
.99 
Services99 
.99 
	AddScoped99 
<99 
IAuthService99 +
,99+ ,
AuthService99- 8
>998 9
(999 :
)99: ;
;99; <
builder<< 
.<< 
Services<< 
.<< 
	AddScoped<< 
<<< "
IUserManagementService== 
,== !
UserManagementService>> 
>>> 
(>> 
)>>  
;>>  !
builderAA 
.AA 
ServicesAA 
.AA 
	AddScopedAA 
<AA 
ITaskServiceAA +
,AA+ ,
TaskServiceAA- 8
>AA8 9
(AA9 :
)AA: ;
;AA; <
builderDD 
.DD 
ServicesDD 
.DD 
	AddScopedDD 
<DD 
IProfileServiceEE 
,EE 
ProfileServiceFF 
>FF 
(FF 
)FF 
;FF 
builderII 
.II 
ServicesII 
.JJ 	
AddAuthenticationJJ	 
(JJ 
JwtBearerDefaultsJJ ,
.JJ, - 
AuthenticationSchemeJJ- A
)JJA B
.KK 	
AddJwtBearerKK	 
(KK 
optionsKK 
=>KK  
{LL 	
varMM 
jwtSettingsMM 
=MM 
builderMM %
.MM% &
ConfigurationMM& 3
.NN 

GetSectionNN 
(NN 
$strNN )
)NN) *
.OO 
GetOO 
<OO 
JwtSettingsOO  
>OO  !
(OO! "
)OO" #
??PP 
throwPP 
newPP %
InvalidOperationExceptionPP 6
(PP6 7
$strQQ 6
)QQ6 7
;QQ7 8
optionsSS 
.SS %
TokenValidationParametersSS -
=SS. /
newSS0 3%
TokenValidationParametersSS4 M
{TT $
ValidateIssuerSigningKeyUU (
=UU) *
trueUU+ /
,UU/ 0
IssuerSigningKeyWW  
=WW! "
newWW# & 
SymmetricSecurityKeyWW' ;
(WW; <
EncodingXX 
.XX 
UTF8XX !
.XX! "
GetBytesXX" *
(XX* +
jwtSettingsXX+ 6
.XX6 7
	SecretKeyXX7 @
)XX@ A
)XXA B
,XXB C
ValidateIssuerZZ 
=ZZ  
trueZZ! %
,ZZ% &
ValidIssuer[[ 
=[[ 
jwtSettings[[ )
.[[) *
Issuer[[* 0
,[[0 1
ValidateAudience]]  
=]]! "
true]]# '
,]]' (
ValidAudience^^ 
=^^ 
jwtSettings^^  +
.^^+ ,
Audience^^, 4
,^^4 5
ValidateLifetime``  
=``! "
true``# '
,``' (
	ClockSkewbb 
=bb 
TimeSpanbb $
.bb$ %
Zerobb% )
}cc 
;cc 
}dd 	
)dd	 

;dd
 
buildergg 
.gg 
Servicesgg 
.gg 
AddAuthorizationgg %
(gg% &
)gg& '
;gg' (
builderjj 
.jj 
Servicesjj 
.jj 
AddControllersjj #
(jj# $
)jj$ %
;jj% &
buildermm 
.mm 
Servicesmm 
.mm 
AddCorsmm 
(mm 
optionsmm $
=>mm% '
{nn 
optionsoo 
.oo 
	AddPolicyoo 
(oo 
$stroo +
,oo+ ,
policyoo- 3
=>oo4 6
{pp 	
policyqq 
.rr 
WithOriginsrr 
(rr 
$strrr 4
)rr4 5
.ss 
AllowAnyHeaderss 
(ss  
)ss  !
.tt 
AllowAnyMethodtt 
(tt  
)tt  !
;tt! "
}uu 	
)uu	 

;uu
 
}vv 
)vv 
;vv 
varxx 
appxx 
=xx 
builderxx 
.xx 
Buildxx 
(xx 
)xx 
;xx 
app{{ 
.{{ $
UseSerilogRequestLogging{{  
({{  !
){{! "
;{{" #
app~~ 
.~~ 
UseMiddleware~~ 
<~~ '
ExceptionHandlingMiddleware~~ 1
>~~1 2
(~~2 3
)~~3 4
;~~4 5
app
ÅÅ 
.
ÅÅ !
UseHttpsRedirection
ÅÅ 
(
ÅÅ 
)
ÅÅ 
;
ÅÅ 
app
ÑÑ 
.
ÑÑ 
UseCors
ÑÑ 
(
ÑÑ 
$str
ÑÑ !
)
ÑÑ! "
;
ÑÑ" #
app
áá 
.
áá 
UseAuthentication
áá 
(
áá 
)
áá 
;
áá 
app
ää 
.
ää 
UseMiddleware
ää 
<
ää )
SessionValidationMiddleware
ää 1
>
ää1 2
(
ää2 3
)
ää3 4
;
ää4 5
app
çç 
.
çç 
UseAuthorization
çç 
(
çç 
)
çç 
;
çç 
app
êê 
.
êê 
MapControllers
êê 
(
êê 
)
êê 
;
êê 
Log
íí 
.
íí 
Information
íí 
(
íí 
$str
íí 7
)
íí7 8
;
íí8 9
app
îî 
.
îî 
Run
îî 
(
îî 
)
îî 
;
îî 
}ïï 
catchññ 
(
ññ "
HostAbortedException
ññ 
)
ññ 
{óó 
}ôô 
catchöö 
(
öö 
	Exception
öö 
	exception
öö 
)
öö 
{õõ 
Log
úú 
.
úú 
Fatal
úú 
(
úú 
	exception
ùù 
,
ùù 
$str
ûû .
)
ûû. /
;
ûû/ 0
}üü 
finally†† 
{°° 
Log
¢¢ 
.
¢¢ 
CloseAndFlush
¢¢ 
(
¢¢ 
)
¢¢ 
;
¢¢ 
}££ ã%
áC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Middleware\SessionValidationMiddleware.cs
	namespace 	
Taskify
 
. 
API 
. 

Middleware  
;  !
public 
class '
SessionValidationMiddleware (
{ 
private		 
readonly		 
RequestDelegate		 $
_next		% *
;		* +
public 
'
SessionValidationMiddleware &
(& '
RequestDelegate' 6
next7 ;
); <
{ 
_next 
= 
next 
; 
} 
public 

async 
Task 
InvokeAsync !
(! "
HttpContext 
context 
, "
IUserSessionRepository 
sessionRepository 0
)0 1
{ 
if 

( 
context 
. 
User 
. 
Identity !
?! "
." #
IsAuthenticated# 2
==3 5
true6 :
): ;
{ 	
var 
tokenIdValue 
= 
context &
.& '
User' +
.+ ,
	FindFirst, 5
(5 6#
JwtRegisteredClaimNames '
.' (
Jti( +
)+ ,
?, -
.- .
Value. 3
;3 4
if 
( 
! 
Guid 
. 
TryParse 
( 
tokenIdValue +
,+ ,
out- 0
var1 4
tokenId5 <
)< =
)= >
{ 
context 
. 
Response  
.  !

StatusCode! +
=, -
StatusCodes 
.  !
Status401Unauthorized  5
;5 6
await 
context 
. 
Response &
.& '
WriteAsJsonAsync' 7
(7 8
new8 ;
{ 
success   
=   
false   #
,  # $
message!! 
=!! 
$str!! ?
}"" 
)"" 
;"" 
return$$ 
;$$ 
}%% 
var'' 
session'' 
='' 
await(( 
sessionRepository(( '
.((' (
GetByTokenIdAsync((( 9
(((9 :
tokenId((: A
)((A B
;((B C
if** 
(** 
session** 
is** 
null** 
||**  "
session**# *
.*** +
	IsRevoked**+ 4
)**4 5
{++ 
context,, 
.,, 
Response,,  
.,,  !

StatusCode,,! +
=,,, -
StatusCodes-- 
.--  !
Status401Unauthorized--  5
;--5 6
await// 
context// 
.// 
Response// &
.//& '
WriteAsJsonAsync//' 7
(//7 8
new//8 ;
{00 
success11 
=11 
false11 #
,11# $
message22 
=22 
$str22 @
}33 
)33 
;33 
return55 
;55 
}66 
if88 
(88 
session88 
.88 
	ExpiresAt88 !
<=88" $
DateTime88% -
.88- .
UtcNow88. 4
)884 5
{99 
await:: 
sessionRepository:: '
.::' (
RevokeAsync::( 3
(::3 4
session::4 ;
)::; <
;::< =
context<< 
.<< 
Response<<  
.<<  !

StatusCode<<! +
=<<, -
StatusCodes== 
.==  !
Status401Unauthorized==  5
;==5 6
await?? 
context?? 
.?? 
Response?? &
.??& '
WriteAsJsonAsync??' 7
(??7 8
new??8 ;
{@@ 
successAA 
=AA 
falseAA #
,AA# $
messageBB 
=BB 
$strBB 9
}CC 
)CC 
;CC 
returnEE 
;EE 
}FF 
sessionHH 
.HH 
LastActivityAtHH "
=HH# $
DateTimeHH% -
.HH- .
UtcNowHH. 4
;HH4 5
awaitJJ 
sessionRepositoryJJ #
.JJ# $
UpdateAsyncJJ$ /
(JJ/ 0
sessionJJ0 7
)JJ7 8
;JJ8 9
}KK 	
awaitMM 
_nextMM 
(MM 
contextMM 
)MM 
;MM 
}NN 
}OO Ä3
áC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Middleware\ExceptionHandlingMiddleware.cs
	namespace 	
Taskify
 
. 
API 
. 

Middleware  
;  !
public

 
class

 '
ExceptionHandlingMiddleware

 (
{ 
private 
readonly 
RequestDelegate $
_next% *
;* +
private 
readonly 
ILogger 
< '
ExceptionHandlingMiddleware 8
>8 9
_logger: A
;A B
public 
'
ExceptionHandlingMiddleware &
(& '
RequestDelegate 
next 
, 
ILogger 
< '
ExceptionHandlingMiddleware +
>+ ,
logger- 3
)3 4
{ 
_next 
= 
next 
; 
_logger 
= 
logger 
; 
} 
public 

async 
Task 
InvokeAsync !
(! "
HttpContext" -
context. 5
)5 6
{ 
try 
{ 	
await 
_next 
( 
context 
)  
;  !
} 	
catch 
( 
	Exception 
	exception "
)" #
{ 	
_logger 
. 
LogError 
( 
	exception   
,   
$str!! O
,!!O P
context"" 
."" 
Request"" 
.""  
Method""  &
,""& '
context## 
.## 
Request## 
.##  
Path##  $
)##$ %
;##% &
await%%  
HandleExceptionAsync%% &
(%%& '
context%%' .
,%%. /
	exception%%0 9
)%%9 :
;%%: ;
}&& 	
}'' 
private)) 
static)) 
async)) 
Task))  
HandleExceptionAsync)) 2
())2 3
HttpContext** 
context** 
,** 
	Exception++ 
	exception++ 
)++ 
{,, 
var-- 
response-- 
=-- 
new-- 
ErrorResponse-- (
(--( )
)--) *
;--* +
switch// 
(// 
	exception// 
)// 
{00 	
case11 
FluentValidation11 !
.11! "
ValidationException11" 5
validationException116 I
:11I J
context22 
.22 
Response22  
.22  !

StatusCode22! +
=22, -
(33 
int33 
)33 
HttpStatusCode33 '
.33' (

BadRequest33( 2
;332 3
response55 
.55 
Message55  
=55! "
$str66 <
;66< =
response88 
.88 
Errors88 
=88  !
validationException99 '
.99' (
Errors99( .
.:: 
GroupBy::  
(::  !
error::! &
=>::' )
error::* /
.::/ 0
PropertyName::0 <
)::< =
.;; 
ToDictionary;; %
(;;% &
group<< !
=><<" $
group<<% *
.<<* +
Key<<+ .
,<<. /
group== !
=>==" $
group==% *
.>>  !
Select>>! '
(>>' (
error>>( -
=>>>. 0
error>>1 6
.>>6 7
ErrorMessage>>7 C
)>>C D
.??  !
Distinct??! )
(??) *
)??* +
.@@  !
ToArray@@! (
(@@( )
)@@) *
)@@* +
;@@+ ,
breakBB 
;BB 
caseDD '
BusinessValidationExceptionDD ,'
businessValidationExceptionDD- H
:DDH I
contextFF 
.FF 
ResponseFF  
.FF  !

StatusCodeFF! +
=FF, -
(GG 
intGG 
)GG 
HttpStatusCodeGG '
.GG' (

BadRequestGG( 2
;GG2 3
responseII 
.II 
MessageII  
=II! "
$strJJ <
;JJ< =
responseLL 
.LL 
ErrorsLL 
=LL  !'
businessValidationExceptionMM /
.MM/ 0
ErrorsMM0 6
;MM6 7
breakOO 
;OO 
caseQQ 
ConflictExceptionQQ "
:QQ" #
contextRR 
.RR 
ResponseRR  
.RR  !

StatusCodeRR! +
=RR, -
(SS 
intSS 
)SS 
HttpStatusCodeSS '
.SS' (
ConflictSS( 0
;SS0 1
responseUU 
.UU 
MessageUU  
=UU! "
	exceptionUU# ,
.UU, -
MessageUU- 4
;UU4 5
breakVV 
;VV 
caseXX #
AuthenticationExceptionXX (
:XX( )
contextYY 
.YY 
ResponseYY 
.YY 

StatusCodeYY 
=YY  !
(ZZ 	
intZZ	 
)ZZ 
HttpStatusCodeZZ 
.ZZ 
UnauthorizedZZ (
;ZZ( )
response\\ 
.\\ 
Message\\ 
=\\ 
	exception\\  
.\\  !
Message\\! (
;\\( )
break]] 	
;]]	 

default__ 
:__ 
context`` 
.`` 
Response``  
.``  !

StatusCode``! +
=``, -
(aa 
intaa 
)aa 
HttpStatusCodeaa '
.aa' (
InternalServerErroraa( ;
;aa; <
responsecc 
.cc 
Messagecc  
=cc! "
$strdd 3
;dd3 4
breakff 
;ff 
}gg 	
contextii 
.ii 
Responseii 
.ii 
ContentTypeii $
=ii% &
$strii' 9
;ii9 :
varkk 
jsonkk 
=kk 
JsonSerializerkk !
.kk! "
	Serializekk" +
(kk+ ,
responsekk, 4
)kk4 5
;kk5 6
awaitmm 
contextmm 
.mm 
Responsemm 
.mm 

WriteAsyncmm )
(mm) *
jsonmm* .
)mm. /
;mm/ 0
}nn 
}oo ã
ÖC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Extensions\ClaimsPrincipalExtensions.cs
	namespace 	
Taskify
 
. 
API 
. 

Extensions  
;  !
public 
static 
class %
ClaimsPrincipalExtensions -
{ 
public 

static 
int 
	GetUserId 
(  
this  $
ClaimsPrincipal% 4
user5 9
)9 :
{		 
var

 
userId

 
=

 
user

 
.

 
FindFirstValue

 (
(

( )#
JwtRegisteredClaimNames

) @
.

@ A
Sub

A D
)

D E
;

E F
if 

( 
! 
int 
. 
TryParse 
( 
userId  
,  !
out" %
var& )
id* ,
), -
)- .
{ 	
throw 
new '
UnauthorizedAccessException 1
(1 2
$str @
)@ A
;A B
} 	
return 
id 
; 
} 
public 

static 
string 
GetUserRole $
($ %
this% )
ClaimsPrincipal* 9
user: >
)> ?
{ 
return 
user 
. 
FindFirstValue "
(" #

ClaimTypes# -
.- .
Role. 2
)2 3
?? 
throw 
new '
UnauthorizedAccessException 4
(4 5
$str B
)B C
;C D
} 
} £
sC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\DTOs\ErrorResponse.cs
	namespace 	
Taskify
 
. 
API 
. 
DTOs 
; 
public 
class 
ErrorResponse 
{ 
public 

bool 
Success 
{ 
get 
; 
set "
;" #
}$ %
=& '
false( -
;- .
public 

string 
Message 
{ 
get 
;  
set! $
;$ %
}& '
=( )
string* 0
.0 1
Empty1 6
;6 7
public		 

IDictionary		 
<		 
string		 
,		 
string		 %
[		% &
]		& '
>		' (
?		( )
Errors		* 0
{		1 2
get		3 6
;		6 7
set		8 ;
;		; <
}		= >
}

 ú
qC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\DTOs\ApiResponse.cs
	namespace 	
Taskify
 
. 
API 
. 
DTOs 
; 
public 
class 
ApiResponse 
< 
T 
> 
{ 
public 

bool 
Success 
{ 
get 
; 
set "
;" #
}$ %
public 

string 
Message 
{ 
get 
;  
set! $
;$ %
}& '
=( )
string* 0
.0 1
Empty1 6
;6 7
public		 

T		 
?		 
Data		 
{		 
get		 
;		 
set		 
;		 
}		  
}

 œ&
{C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Controllers\UserController.cs
	namespace 	
Taskify
 
. 
API 
. 
Controllers !
;! "
[ 
ApiController 
] 
[		 
Route		 
(		 
$str		 
)		 
]		 
[

 
	Authorize

 

(


 
Roles

 
=

 
$str

 %
)

% &
]

& '
public 
class 
UserController 
: 
ControllerBase ,
{ 
private 
readonly "
IUserManagementService +"
_userManagementService, B
;B C
public 

UserController 
( "
IUserManagementService !
userManagementService 4
)4 5
{ "
_userManagementService 
=  !
userManagementService! 6
;6 7
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $
GetAllUsers% 0
(0 1
)1 2
{ 
var 
currentAdminId 
= 
GetCurrentUserId -
(- .
). /
;/ 0
var 
users 
= 
await "
_userManagementService (
.( )
GetAllUsersAsync) 9
(9 :
currentAdminId   
)   
;    
return"" 
Ok"" 
("" 
users"" 
)"" 
;"" 
}## 
[)) 
	HttpPatch)) 
()) 
$str)) "
)))" #
]))# $
public** 

async** 
Task** 
<** 
IActionResult** #
>**# $
ActivateUser**% 1
(**1 2
int**2 5
id**6 8
)**8 9
{++ 
var,, 
currentAdminId,, 
=,, 
GetCurrentUserId,, -
(,,- .
),,. /
;,,/ 0
await.. "
_userManagementService.. $
...$ %
ActivateUserAsync..% 6
(..6 7
id// 
,// 
currentAdminId00 
)00 
;00 
return22 
	NoContent22 
(22 
)22 
;22 
}33 
[99 
	HttpPatch99 
(99 
$str99 $
)99$ %
]99% &
public:: 

async:: 
Task:: 
<:: 
IActionResult:: #
>::# $
DeactivateUser::% 3
(::3 4
int::4 7
id::8 :
)::: ;
{;; 
var<< 
currentAdminId<< 
=<< 
GetCurrentUserId<< -
(<<- .
)<<. /
;<</ 0
await>> "
_userManagementService>> $
.>>$ %
DeactivateUserAsync>>% 8
(>>8 9
id?? 
,?? 
currentAdminId@@ 
)@@ 
;@@ 
returnBB 
	NoContentBB 
(BB 
)BB 
;BB 
}CC 
[II 

HttpDeleteII 
(II 
$strII 
)II 
]II 
publicJJ 

asyncJJ 
TaskJJ 
<JJ 
IActionResultJJ #
>JJ# $

DeleteUserJJ% /
(JJ/ 0
intJJ0 3
idJJ4 6
)JJ6 7
{KK 
varLL 
currentAdminIdLL 
=LL 
GetCurrentUserIdLL -
(LL- .
)LL. /
;LL/ 0
awaitNN "
_userManagementServiceNN $
.NN$ %
DeleteUserAsyncNN% 4
(NN4 5
idOO 
,OO 
currentAdminIdPP 
)PP 
;PP 
returnRR 
	NoContentRR 
(RR 
)RR 
;RR 
}SS 
privateYY 
intYY 
GetCurrentUserIdYY  
(YY  !
)YY! "
{ZZ 
var[[ 
userIdClaim[[ 
=[[ 
User\\ 
.\\ 
	FindFirst\\ 
(\\ 

ClaimTypes\\ %
.\\% &
NameIdentifier\\& 4
)\\4 5
?\\5 6
.\\6 7
Value\\7 <
;\\< =
if^^ 

(^^ 
!^^ 
int^^ 
.^^ 
TryParse^^ 
(^^ 
userIdClaim^^ %
,^^% &
out^^' *
var^^+ .
userId^^/ 5
)^^5 6
)^^6 7
{__ 	
throw`` 
new`` '
UnauthorizedAccessException`` 1
(``1 2
$straa 8
)aa8 9
;aa9 :
}bb 	
returndd 
userIddd 
;dd 
}ee 
}ff ÖÖ
{C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Controllers\TaskController.cs
	namespace 	
Taskify
 
. 
API 
. 
Controllers !
;! "
[		 
ApiController		 
]		 
[

 
Route

 
(

 
$str

 
)

 
]

 
[ 
	Authorize 

]
 
public 
class 
TasksController 
: 
ControllerBase -
{ 
private 
readonly 
ITaskService !
_taskService" .
;. /
public 

TasksController 
( 
ITaskService '
taskService( 3
)3 4
{ 
_taskService 
= 
taskService "
;" #
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $

GetMyTasks% /
(/ 0
)0 1
{ 
var 
userId 
= 
GetCurrentUserId %
(% &
)& '
;' (
var 
userRole 
= 
GetCurrentUserRole )
() *
)* +
;+ ,
var 
tasks 
= 
await 
_taskService &
.& '
GetMyTasksAsync' 6
(6 7
userId7 =
,= >
userRole? G
)G H
;H I
return 
Ok 
( 
new 
{ 
success 
=  !
true" &
,& '
data( ,
=- .
tasks/ 4
}5 6
)6 7
;7 8
}   
["" 
HttpGet"" 
("" 
$str"" 
)"" 
]"" 
public## 

async## 
Task## 
<## 
IActionResult## #
>### $
GetAssignedTasks##% 5
(##5 6
)##6 7
{$$ 
var%% 
userId%% 
=%% 
GetCurrentUserId%% %
(%%% &
)%%& '
;%%' (
var&& 
userRole&& 
=&& 
GetCurrentUserRole&& )
(&&) *
)&&* +
;&&+ ,
var'' 
tasks'' 
='' 
await'' 
_taskService'' &
.''& '!
GetAssignedTasksAsync''' <
(''< =
userId''= C
,''C D
userRole''E M
)''M N
;''N O
return(( 
Ok(( 
((( 
new(( 
{(( 
success(( 
=((  !
true((" &
,((& '
data((( ,
=((- .
tasks((/ 4
}((5 6
)((6 7
;((7 8
})) 
[++ 
HttpGet++ 
(++ 
$str++ 
)++ 
]++ 
public,, 

async,, 
Task,, 
<,, 
IActionResult,, #
>,,# $
GetPendingTasks,,% 4
(,,4 5
),,5 6
{-- 
var.. 
userId.. 
=.. 
GetCurrentUserId.. %
(..% &
)..& '
;..' (
var// 
userRole// 
=// 
GetCurrentUserRole// )
(//) *
)//* +
;//+ ,
var00 
tasks00 
=00 
await00 
_taskService00 &
.00& ' 
GetPendingTasksAsync00' ;
(00; <
userId00< B
,00B C
userRole00D L
)00L M
;00M N
return11 
Ok11 
(11 
new11 
{11 
success11 
=11  !
true11" &
,11& '
data11( ,
=11- .
tasks11/ 4
}115 6
)116 7
;117 8
}22 
[44 
HttpGet44 
(44 
$str44 
)44 
]44 
public55 

async55 
Task55 
<55 
IActionResult55 #
>55# $
GetInProgressTasks55% 7
(557 8
)558 9
{66 
var77 
userId77 
=77 
GetCurrentUserId77 %
(77% &
)77& '
;77' (
var88 
userRole88 
=88 
GetCurrentUserRole88 )
(88) *
)88* +
;88+ ,
var99 
tasks99 
=99 
await99 
_taskService99 &
.99& '#
GetInProgressTasksAsync99' >
(99> ?
userId99? E
,99E F
userRole99G O
)99O P
;99P Q
return:: 
Ok:: 
(:: 
new:: 
{:: 
success:: 
=::  !
true::" &
,::& '
data::( ,
=::- .
tasks::/ 4
}::5 6
)::6 7
;::7 8
};; 
[== 
HttpGet== 
(== 
$str== 
)== 
]== 
public>> 

async>> 
Task>> 
<>> 
IActionResult>> #
>>># $
GetCompletedTasks>>% 6
(>>6 7
)>>7 8
{?? 
var@@ 
userId@@ 
=@@ 
GetCurrentUserId@@ %
(@@% &
)@@& '
;@@' (
varAA 
userRoleAA 
=AA 
GetCurrentUserRoleAA )
(AA) *
)AA* +
;AA+ ,
varBB 
tasksBB 
=BB 
awaitBB 
_taskServiceBB &
.BB& '"
GetCompletedTasksAsyncBB' =
(BB= >
userIdBB> D
,BBD E
userRoleBBF N
)BBN O
;BBO P
returnCC 
OkCC 
(CC 
newCC 
{CC 
successCC 
=CC  !
trueCC" &
,CC& '
dataCC( ,
=CC- .
tasksCC/ 4
}CC5 6
)CC6 7
;CC7 8
}DD 
[FF 
HttpGetFF 
(FF 
$strFF 
)FF 
]FF 
publicGG 

asyncGG 
TaskGG 
<GG 
IActionResultGG #
>GG# $
GetCancelledTasksGG% 6
(GG6 7
)GG7 8
{HH 
varII 
userIdII 
=II 
GetCurrentUserIdII %
(II% &
)II& '
;II' (
varJJ 
userRoleJJ 
=JJ 
GetCurrentUserRoleJJ )
(JJ) *
)JJ* +
;JJ+ ,
varKK 
tasksKK 
=KK 
awaitKK 
_taskServiceKK &
.KK& '"
GetCancelledTasksAsyncKK' =
(KK= >
userIdKK> D
,KKD E
userRoleKKF N
)KKN O
;KKO P
returnLL 
OkLL 
(LL 
newLL 
{LL 
successLL 
=LL  !
trueLL" &
,LL& '
dataLL( ,
=LL- .
tasksLL/ 4
}LL5 6
)LL6 7
;LL7 8
}MM 
[OO 
HttpGetOO 
(OO 
$strOO 
)OO 
]OO 
publicPP 

asyncPP 
TaskPP 
<PP 
IActionResultPP #
>PP# $
GetOverdueTasksPP% 4
(PP4 5
)PP5 6
{QQ 
varRR 
userIdRR 
=RR 
GetCurrentUserIdRR %
(RR% &
)RR& '
;RR' (
varSS 
userRoleSS 
=SS 
GetCurrentUserRoleSS )
(SS) *
)SS* +
;SS+ ,
varTT 
tasksTT 
=TT 
awaitTT 
_taskServiceTT &
.TT& ' 
GetOverdueTasksAsyncTT' ;
(TT; <
userIdTT< B
,TTB C
userRoleTTD L
)TTL M
;TTM N
returnUU 
OkUU 
(UU 
newUU 
{UU 
successUU 
=UU  !
trueUU" &
,UU& '
dataUU( ,
=UU- .
tasksUU/ 4
}UU5 6
)UU6 7
;UU7 8
}VV 
[XX 
HttpGetXX 
(XX 
$strXX 
)XX 
]XX 
publicYY 

asyncYY 
TaskYY 
<YY 
IActionResultYY #
>YY# $
GetTaskYY% ,
(YY, -
intYY- 0
idYY1 3
)YY3 4
{ZZ 
var[[ 
userId[[ 
=[[ 
GetCurrentUserId[[ %
([[% &
)[[& '
;[[' (
var\\ 
userRole\\ 
=\\ 
GetCurrentUserRole\\ )
(\\) *
)\\* +
;\\+ ,
var]] 
task]] 
=]] 
await]] 
_taskService]] %
.]]% &
GetTaskByIdAsync]]& 6
(]]6 7
id]]7 9
,]]9 :
userId]]; A
,]]A B
userRole]]C K
)]]K L
;]]L M
return^^ 
Ok^^ 
(^^ 
new^^ 
{^^ 
success^^ 
=^^  !
true^^" &
,^^& '
data^^( ,
=^^- .
task^^/ 3
}^^4 5
)^^5 6
;^^6 7
}__ 
[aa 
HttpPostaa 
]aa 
publicbb 

asyncbb 
Taskbb 
<bb 
IActionResultbb #
>bb# $

CreateTaskbb% /
(bb/ 0
[bb0 1
FromBodybb1 9
]bb9 :
CreateTaskRequestbb; L
requestbbM T
)bbT U
{cc 
vardd 
userIddd 
=dd 
GetCurrentUserIddd %
(dd% &
)dd& '
;dd' (
varee 
userRoleee 
=ee 
GetCurrentUserRoleee )
(ee) *
)ee* +
;ee+ ,
varff 
taskff 
=ff 
awaitff 
_taskServiceff %
.ff% &
CreateTaskAsyncff& 5
(ff5 6
requestff6 =
,ff= >
userIdff? E
,ffE F
userRoleffG O
)ffO P
;ffP Q
returngg 

StatusCodegg 
(gg 
StatusCodesgg %
.gg% &
Status201Createdgg& 6
,gg6 7
newgg8 ;
{hh 	
successii 
=ii 
trueii 
,ii 
messagejj 
=jj 
$strjj 2
,jj2 3
datakk 
=kk 
taskkk 
}ll 	
)ll	 

;ll
 
}mm 
[oo 
HttpPutoo 
(oo 
$stroo 
)oo 
]oo 
publicpp 

asyncpp 
Taskpp 
<pp 
IActionResultpp #
>pp# $

UpdateTaskpp% /
(pp/ 0
intpp0 3
idpp4 6
,pp6 7
[pp8 9
FromBodypp9 A
]ppA B
UpdateTaskRequestppC T
requestppU \
)pp\ ]
{qq 
varrr 
userIdrr 
=rr 
GetCurrentUserIdrr %
(rr% &
)rr& '
;rr' (
varss 
userRoless 
=ss 
GetCurrentUserRoless )
(ss) *
)ss* +
;ss+ ,
vartt 
tasktt 
=tt 
awaittt 
_taskServicett %
.tt% &
UpdateTaskAsynctt& 5
(tt5 6
idtt6 8
,tt8 9
requesttt: A
,ttA B
userIdttC I
,ttI J
userRolettK S
)ttS T
;ttT U
returnuu 
Okuu 
(uu 
newuu 
{uu 
successuu 
=uu  !
trueuu" &
,uu& '
messageuu( /
=uu0 1
$struu2 N
,uuN O
datauuP T
=uuU V
taskuuW [
}uu\ ]
)uu] ^
;uu^ _
}vv 
[xx 
	HttpPatchxx 
(xx 
$strxx  
)xx  !
]xx! "
publicyy 

asyncyy 
Taskyy 
<yy 
IActionResultyy #
>yy# $
ChangeTaskStatusyy% 5
(yy5 6
intyy6 9
idyy: <
,yy< =
[yy> ?
FromBodyyy? G
]yyG H#
UpdateTaskStatusRequestyyI `
requestyya h
)yyh i
{zz 
var{{ 
userId{{ 
={{ 
GetCurrentUserId{{ %
({{% &
){{& '
;{{' (
var|| 
userRole|| 
=|| 
GetCurrentUserRole|| )
(||) *
)||* +
;||+ ,
var}} 
task}} 
=}} 
await}} 
_taskService}} %
.}}% &
ChangeStatusAsync}}& 7
(}}7 8
id}}8 :
,}}: ;
request}}< C
,}}C D
userId}}E K
,}}K L
userRole}}M U
)}}U V
;}}V W
return~~ 
Ok~~ 
(~~ 
new~~ 
{~~ 
success~~ 
=~~  !
true~~" &
,~~& '
message~~( /
=~~0 1
$str~~2 U
,~~U V
data~~W [
=~~\ ]
task~~^ b
}~~c d
)~~d e
;~~e f
} 
[
ÅÅ 

HttpDelete
ÅÅ 
(
ÅÅ 
$str
ÅÅ 
)
ÅÅ 
]
ÅÅ 
public
ÇÇ 

async
ÇÇ 
Task
ÇÇ 
<
ÇÇ 
IActionResult
ÇÇ #
>
ÇÇ# $

DeleteTask
ÇÇ% /
(
ÇÇ/ 0
int
ÇÇ0 3
id
ÇÇ4 6
)
ÇÇ6 7
{
ÉÉ 
var
ÑÑ 
userId
ÑÑ 
=
ÑÑ 
GetCurrentUserId
ÑÑ %
(
ÑÑ% &
)
ÑÑ& '
;
ÑÑ' (
var
ÖÖ 
userRole
ÖÖ 
=
ÖÖ  
GetCurrentUserRole
ÖÖ )
(
ÖÖ) *
)
ÖÖ* +
;
ÖÖ+ ,
await
ÜÜ 
_taskService
ÜÜ 
.
ÜÜ 
DeleteTaskAsync
ÜÜ *
(
ÜÜ* +
id
ÜÜ+ -
,
ÜÜ- .
userId
ÜÜ/ 5
,
ÜÜ5 6
userRole
ÜÜ7 ?
)
ÜÜ? @
;
ÜÜ@ A
return
áá 
Ok
áá 
(
áá 
new
áá 
{
áá 
success
áá 
=
áá  !
true
áá" &
,
áá& '
message
áá( /
=
áá0 1
$str
áá2 N
}
ááO P
)
ááP Q
;
ááQ R
}
àà 
[
éé 
HttpGet
éé 
(
éé 
$str
éé 
)
éé  
]
éé  !
[
èè 
	Authorize
èè 
(
èè 
Roles
èè 
=
èè 
$str
èè 
)
èè 
]
èè  
public
êê 

async
êê 
Task
êê 
<
êê 
IActionResult
êê #
>
êê# $
GetAdminTasks
êê% 2
(
êê2 3
[
êê3 4
	FromQuery
êê4 =
]
êê= >
int
êê? B
page
êêC G
=
êêH I
$num
êêJ K
,
êêK L
[
êêM N
	FromQuery
êêN W
]
êêW X
int
êêY \
pageSize
êê] e
=
êêf g
$num
êêh j
)
êêj k
{
ëë 
if
íí 

(
íí 
page
íí 
<
íí 
$num
íí 
)
íí 
return
ìì 

BadRequest
ìì 
(
ìì 
new
ìì !
{
ìì" #
success
ìì$ +
=
ìì, -
false
ìì. 3
,
ìì3 4
message
ìì5 <
=
ìì= >
$str
ìì? i
}
ììj k
)
ììk l
;
ììl m
if
ïï 

(
ïï 
pageSize
ïï 
<
ïï 
$num
ïï 
||
ïï 
pageSize
ïï $
>
ïï% &
$num
ïï' *
)
ïï* +
return
ññ 

BadRequest
ññ 
(
ññ 
new
ññ !
{
ññ" #
success
ññ$ +
=
ññ, -
false
ññ. 3
,
ññ3 4
message
ññ5 <
=
ññ= >
$str
ññ? e
}
ññf g
)
ññg h
;
ññh i
var
òò 
adminUserId
òò 
=
òò 
GetCurrentUserId
òò *
(
òò* +
)
òò+ ,
;
òò, -
var
ôô 
	adminRole
ôô 
=
ôô  
GetCurrentUserRole
ôô *
(
ôô* +
)
ôô+ ,
;
ôô, -
var
öö 
result
öö 
=
öö 
await
öö 
_taskService
öö '
.
öö' ( 
GetAdminTasksAsync
öö( :
(
öö: ;
page
öö; ?
,
öö? @
pageSize
ööA I
,
ööI J
adminUserId
ööK V
,
ööV W
	adminRole
ööX a
)
ööa b
;
ööb c
return
õõ 
Ok
õõ 
(
õõ 
new
õõ 
{
õõ 
success
õõ 
=
õõ  !
true
õõ" &
,
õõ& '
data
õõ( ,
=
õõ- .
result
õõ/ 5
}
õõ6 7
)
õõ7 8
;
õõ8 9
}
úú 
[
ûû 
HttpGet
ûû 
(
ûû 
$str
ûû *
)
ûû* +
]
ûû+ ,
[
üü 
	Authorize
üü 
(
üü 
Roles
üü 
=
üü 
$str
üü 
)
üü 
]
üü  
public
†† 

async
†† 
Task
†† 
<
†† 
IActionResult
†† #
>
††# $$
GetAdminTaskStatistics
††% ;
(
††; <
)
††< =
{
°° 
var
¢¢ 
adminUserId
¢¢ 
=
¢¢ 
GetCurrentUserId
¢¢ *
(
¢¢* +
)
¢¢+ ,
;
¢¢, -
var
££ 
	adminRole
££ 
=
££  
GetCurrentUserRole
££ *
(
££* +
)
££+ ,
;
££, -
var
§§ 

statistics
§§ 
=
§§ 
await
§§ 
_taskService
§§ +
.
§§+ ,)
GetAdminTaskStatisticsAsync
§§, G
(
§§G H
adminUserId
§§H S
,
§§S T
	adminRole
§§U ^
)
§§^ _
;
§§_ `
return
•• 
Ok
•• 
(
•• 
new
•• 
{
•• 
success
•• 
=
••  !
true
••" &
,
••& '
data
••( ,
=
••- .

statistics
••/ 9
}
••: ;
)
••; <
;
••< =
}
¶¶ 
[
®® 
HttpGet
®® 
(
®® 
$str
®® (
)
®®( )
]
®®) *
[
©© 
	Authorize
©© 
(
©© 
Roles
©© 
=
©© 
$str
©© 
)
©© 
]
©©  
public
™™ 

async
™™ 
Task
™™ 
<
™™ 
IActionResult
™™ #
>
™™# $
GetAdminTask
™™% 1
(
™™1 2
int
™™2 5
id
™™6 8
)
™™8 9
{
´´ 
var
¨¨ 
adminUserId
¨¨ 
=
¨¨ 
GetCurrentUserId
¨¨ *
(
¨¨* +
)
¨¨+ ,
;
¨¨, -
var
≠≠ 
	adminRole
≠≠ 
=
≠≠  
GetCurrentUserRole
≠≠ *
(
≠≠* +
)
≠≠+ ,
;
≠≠, -
var
ÆÆ 
task
ÆÆ 
=
ÆÆ 
await
ÆÆ 
_taskService
ÆÆ %
.
ÆÆ% &#
GetAdminTaskByIdAsync
ÆÆ& ;
(
ÆÆ; <
id
ÆÆ< >
,
ÆÆ> ?
adminUserId
ÆÆ@ K
,
ÆÆK L
	adminRole
ÆÆM V
)
ÆÆV W
;
ÆÆW X
return
ØØ 
Ok
ØØ 
(
ØØ 
new
ØØ 
{
ØØ 
success
ØØ 
=
ØØ  !
true
ØØ" &
,
ØØ& '
data
ØØ( ,
=
ØØ- .
task
ØØ/ 3
}
ØØ4 5
)
ØØ5 6
;
ØØ6 7
}
∞∞ 
[
≤≤ 
HttpPost
≤≤ 
(
≤≤ 
$str
≤≤  
)
≤≤  !
]
≤≤! "
[
≥≥ 
	Authorize
≥≥ 
(
≥≥ 
Roles
≥≥ 
=
≥≥ 
$str
≥≥ 
)
≥≥ 
]
≥≥  
public
¥¥ 

async
¥¥ 
Task
¥¥ 
<
¥¥ 
IActionResult
¥¥ #
>
¥¥# $
CreateAdminTask
¥¥% 4
(
¥¥4 5
[
¥¥5 6
FromBody
¥¥6 >
]
¥¥> ?
CreateTaskRequest
¥¥@ Q
request
¥¥R Y
)
¥¥Y Z
{
µµ 
var
∂∂ 
adminUserId
∂∂ 
=
∂∂ 
GetCurrentUserId
∂∂ *
(
∂∂* +
)
∂∂+ ,
;
∂∂, -
var
∑∑ 
	adminRole
∑∑ 
=
∑∑  
GetCurrentUserRole
∑∑ *
(
∑∑* +
)
∑∑+ ,
;
∑∑, -
var
∏∏ 
task
∏∏ 
=
∏∏ 
await
∏∏ 
_taskService
∏∏ %
.
∏∏% &"
CreateAdminTaskAsync
∏∏& :
(
∏∏: ;
request
∏∏; B
,
∏∏B C
adminUserId
∏∏D O
,
∏∏O P
	adminRole
∏∏Q Z
)
∏∏Z [
;
∏∏[ \
return
ππ 

StatusCode
ππ 
(
ππ 
StatusCodes
ππ %
.
ππ% &
Status201Created
ππ& 6
,
ππ6 7
new
ππ8 ;
{
∫∫ 	
success
ªª 
=
ªª 
true
ªª 
,
ªª 
message
ºº 
=
ºº 
$str
ºº ?
,
ºº? @
data
ΩΩ 
=
ΩΩ 
task
ΩΩ 
}
ææ 	
)
ææ	 

;
ææ
 
}
øø 
[
¡¡ 
	HttpPatch
¡¡ 
(
¡¡ 
$str
¡¡ 1
)
¡¡1 2
]
¡¡2 3
[
¬¬ 
	Authorize
¬¬ 
(
¬¬ 
Roles
¬¬ 
=
¬¬ 
$str
¬¬ 
)
¬¬ 
]
¬¬  
public
√√ 

async
√√ 
Task
√√ 
<
√√ 
IActionResult
√√ #
>
√√# $#
UpdateAdminTaskStatus
√√% :
(
√√: ;
int
√√; >
id
√√? A
,
√√A B
[
√√C D
FromBody
√√D L
]
√√L M%
UpdateTaskStatusRequest
√√N e
request
√√f m
)
√√m n
{
ƒƒ 
var
≈≈ 
adminUserId
≈≈ 
=
≈≈ 
GetCurrentUserId
≈≈ *
(
≈≈* +
)
≈≈+ ,
;
≈≈, -
var
∆∆ 
	adminRole
∆∆ 
=
∆∆  
GetCurrentUserRole
∆∆ *
(
∆∆* +
)
∆∆+ ,
;
∆∆, -
var
«« 
task
«« 
=
«« 
await
«« 
_taskService
«« %
.
««% &(
ChangeAdminTaskStatusAsync
««& @
(
««@ A
id
««A C
,
««C D
request
««E L
,
««L M
adminUserId
««N Y
,
««Y Z
	adminRole
««[ d
)
««d e
;
««e f
return
»» 
Ok
»» 
(
»» 
new
»» 
{
»» 
success
»» 
=
»»  !
true
»»" &
,
»»& '
message
»»( /
=
»»0 1
$str
»»2 U
,
»»U V
data
»»W [
=
»»\ ]
task
»»^ b
}
»»c d
)
»»d e
;
»»e f
}
…… 
[
ÀÀ 
	HttpPatch
ÀÀ 
(
ÀÀ 
$str
ÀÀ 3
)
ÀÀ3 4
]
ÀÀ4 5
[
ÃÃ 
	Authorize
ÃÃ 
(
ÃÃ 
Roles
ÃÃ 
=
ÃÃ 
$str
ÃÃ 
)
ÃÃ 
]
ÃÃ  
public
ÕÕ 

async
ÕÕ 
Task
ÕÕ 
<
ÕÕ 
IActionResult
ÕÕ #
>
ÕÕ# $$
UpdateAdminTaskDueDate
ÕÕ% ;
(
ÕÕ; <
int
ÕÕ< ?
id
ÕÕ@ B
,
ÕÕB C
[
ÕÕD E
FromBody
ÕÕE M
]
ÕÕM N&
UpdateTaskDueDateRequest
ÕÕO g
request
ÕÕh o
)
ÕÕo p
{
ŒŒ 
var
œœ 
adminUserId
œœ 
=
œœ 
GetCurrentUserId
œœ *
(
œœ* +
)
œœ+ ,
;
œœ, -
var
–– 
	adminRole
–– 
=
––  
GetCurrentUserRole
–– *
(
––* +
)
––+ ,
;
––, -
var
—— 
task
—— 
=
—— 
await
—— 
_taskService
—— %
.
——% &)
ChangeAdminTaskDueDateAsync
——& A
(
——A B
id
——B D
,
——D E
request
——F M
,
——M N
adminUserId
——O Z
,
——Z [
	adminRole
——\ e
)
——e f
;
——f g
return
““ 
Ok
““ 
(
““ 
new
““ 
{
““ 
success
““ 
=
““  !
true
““" &
,
““& '
message
““( /
=
““0 1
$str
““2 W
,
““W X
data
““Y ]
=
““^ _
task
““` d
}
““e f
)
““f g
;
““g h
}
”” 
[
’’ 
	HttpPatch
’’ 
(
’’ 
$str
’’ 3
)
’’3 4
]
’’4 5
[
÷÷ 
	Authorize
÷÷ 
(
÷÷ 
Roles
÷÷ 
=
÷÷ 
$str
÷÷ 
)
÷÷ 
]
÷÷  
public
◊◊ 

async
◊◊ 
Task
◊◊ 
<
◊◊ 
IActionResult
◊◊ #
>
◊◊# $%
UpdateAdminTaskPriority
◊◊% <
(
◊◊< =
int
◊◊= @
id
◊◊A C
,
◊◊C D
[
◊◊E F
FromBody
◊◊F N
]
◊◊N O'
UpdateTaskPriorityRequest
◊◊P i
request
◊◊j q
)
◊◊q r
{
ÿÿ 
var
ŸŸ 
adminUserId
ŸŸ 
=
ŸŸ 
GetCurrentUserId
ŸŸ *
(
ŸŸ* +
)
ŸŸ+ ,
;
ŸŸ, -
var
⁄⁄ 
	adminRole
⁄⁄ 
=
⁄⁄  
GetCurrentUserRole
⁄⁄ *
(
⁄⁄* +
)
⁄⁄+ ,
;
⁄⁄, -
var
€€ 
task
€€ 
=
€€ 
await
€€ 
_taskService
€€ %
.
€€% &*
ChangeAdminTaskPriorityAsync
€€& B
(
€€B C
id
€€C E
,
€€E F
request
€€G N
,
€€N O
adminUserId
€€P [
,
€€[ \
	adminRole
€€] f
)
€€f g
;
€€g h
return
‹‹ 
Ok
‹‹ 
(
‹‹ 
new
‹‹ 
{
‹‹ 
success
‹‹ 
=
‹‹  !
true
‹‹" &
,
‹‹& '
message
‹‹( /
=
‹‹0 1
$str
‹‹2 W
,
‹‹W X
data
‹‹Y ]
=
‹‹^ _
task
‹‹` d
}
‹‹e f
)
‹‹f g
;
‹‹g h
}
›› 
[
ﬂﬂ 
HttpPut
ﬂﬂ 
(
ﬂﬂ 
$str
ﬂﬂ (
)
ﬂﬂ( )
]
ﬂﬂ) *
[
‡‡ 
	Authorize
‡‡ 
(
‡‡ 
Roles
‡‡ 
=
‡‡ 
$str
‡‡ 
)
‡‡ 
]
‡‡  
public
·· 

async
·· 
Task
·· 
<
·· 
IActionResult
·· #
>
··# $
UpdateAdminTask
··% 4
(
··4 5
int
··5 8
id
··9 ;
,
··; <
[
··= >
FromBody
··> F
]
··F G
UpdateTaskRequest
··H Y
request
··Z a
)
··a b
{
‚‚ 
var
„„ 
adminUserId
„„ 
=
„„ 
GetCurrentUserId
„„ *
(
„„* +
)
„„+ ,
;
„„, -
var
‰‰ 
	adminRole
‰‰ 
=
‰‰  
GetCurrentUserRole
‰‰ *
(
‰‰* +
)
‰‰+ ,
;
‰‰, -
var
ÂÂ 
task
ÂÂ 
=
ÂÂ 
await
ÂÂ 
_taskService
ÂÂ %
.
ÂÂ% &"
UpdateAdminTaskAsync
ÂÂ& :
(
ÂÂ: ;
id
ÂÂ; =
,
ÂÂ= >
request
ÂÂ? F
,
ÂÂF G
adminUserId
ÂÂH S
,
ÂÂS T
	adminRole
ÂÂU ^
)
ÂÂ^ _
;
ÂÂ_ `
return
ÊÊ 
Ok
ÊÊ 
(
ÊÊ 
new
ÊÊ 
{
ÊÊ 
success
ÊÊ 
=
ÊÊ  !
true
ÊÊ" &
,
ÊÊ& '
message
ÊÊ( /
=
ÊÊ0 1
$str
ÊÊ2 N
,
ÊÊN O
data
ÊÊP T
=
ÊÊU V
task
ÊÊW [
}
ÊÊ\ ]
)
ÊÊ] ^
;
ÊÊ^ _
}
ÁÁ 
[
ÈÈ 

HttpDelete
ÈÈ 
(
ÈÈ 
$str
ÈÈ +
)
ÈÈ+ ,
]
ÈÈ, -
[
ÍÍ 
	Authorize
ÍÍ 
(
ÍÍ 
Roles
ÍÍ 
=
ÍÍ 
$str
ÍÍ 
)
ÍÍ 
]
ÍÍ  
public
ÎÎ 

async
ÎÎ 
Task
ÎÎ 
<
ÎÎ 
IActionResult
ÎÎ #
>
ÎÎ# $
DeleteAdminTask
ÎÎ% 4
(
ÎÎ4 5
int
ÎÎ5 8
id
ÎÎ9 ;
)
ÎÎ; <
{
ÏÏ 
var
ÌÌ 
adminUserId
ÌÌ 
=
ÌÌ 
GetCurrentUserId
ÌÌ *
(
ÌÌ* +
)
ÌÌ+ ,
;
ÌÌ, -
var
ÓÓ 
	adminRole
ÓÓ 
=
ÓÓ  
GetCurrentUserRole
ÓÓ *
(
ÓÓ* +
)
ÓÓ+ ,
;
ÓÓ, -
await
ÔÔ 
_taskService
ÔÔ 
.
ÔÔ "
DeleteAdminTaskAsync
ÔÔ /
(
ÔÔ/ 0
id
ÔÔ0 2
,
ÔÔ2 3
adminUserId
ÔÔ4 ?
,
ÔÔ? @
	adminRole
ÔÔA J
)
ÔÔJ K
;
ÔÔK L
return
 
Ok
 
(
 
new
 
{
 
success
 
=
  !
true
" &
,
& '
message
( /
=
0 1
$str
2 N
}
O P
)
P Q
;
Q R
}
ÒÒ 
[
˜˜ 
HttpGet
˜˜ 
(
˜˜ 
$str
˜˜ %
)
˜˜% &
]
˜˜& '
[
¯¯ 
	Authorize
¯¯ 
(
¯¯ 
Roles
¯¯ 
=
¯¯ 
$str
¯¯ 
)
¯¯ 
]
¯¯  
public
˘˘ 

async
˘˘ 
Task
˘˘ 
<
˘˘ 
IActionResult
˘˘ #
>
˘˘# $#
GetUsersForAssignment
˘˘% :
(
˘˘: ;
[
˘˘; <
	FromQuery
˘˘< E
]
˘˘E F
int
˘˘G J
pageSize
˘˘K S
=
˘˘T U
$num
˘˘V Y
)
˘˘Y Z
{
˙˙ 
if
˚˚ 

(
˚˚ 
pageSize
˚˚ 
<
˚˚ 
$num
˚˚ 
||
˚˚ 
pageSize
˚˚ $
>
˚˚% &
$num
˚˚' *
)
˚˚* +
return
¸¸ 

BadRequest
¸¸ 
(
¸¸ 
new
¸¸ !
{
¸¸" #
success
¸¸$ +
=
¸¸, -
false
¸¸. 3
,
¸¸3 4
message
¸¸5 <
=
¸¸= >
$str
¸¸? e
}
¸¸f g
)
¸¸g h
;
¸¸h i
var
˛˛ 
users
˛˛ 
=
˛˛ 
await
˛˛ 
_taskService
˛˛ &
.
˛˛& '(
GetUsersForAssignmentAsync
˛˛' A
(
˛˛A B
)
˛˛B C
;
˛˛C D
return
ˇˇ 
Ok
ˇˇ 
(
ˇˇ 
new
ˇˇ 
{
ˇˇ 
success
ˇˇ 
=
ˇˇ  !
true
ˇˇ" &
,
ˇˇ& '
data
ˇˇ( ,
=
ˇˇ- .
users
ˇˇ/ 4
}
ˇˇ5 6
)
ˇˇ6 7
;
ˇˇ7 8
}
ÄÄ 
private
ÜÜ 
int
ÜÜ 
GetCurrentUserId
ÜÜ  
(
ÜÜ  !
)
ÜÜ! "
{
áá 
var
àà 
userIdClaim
àà 
=
àà 
User
àà 
.
àà 
	FindFirst
àà (
(
àà( )

ClaimTypes
àà) 3
.
àà3 4
NameIdentifier
àà4 B
)
ààB C
;
ààC D
if
ââ 

(
ââ 
userIdClaim
ââ 
is
ââ 
null
ââ 
||
ââ  "
!
ââ# $
int
ââ$ '
.
ââ' (
TryParse
ââ( 0
(
ââ0 1
userIdClaim
ââ1 <
.
ââ< =
Value
ââ= B
,
ââB C
out
ââD G
var
ââH K
userId
ââL R
)
ââR S
)
ââS T
throw
ää 
new
ää 
Taskify
ää 
.
ää 
Business
ää &
.
ää& '

Exceptions
ää' 1
.
ää1 2%
AuthenticationException
ää2 I
(
ääI J
$str
ääJ k
)
ääk l
;
ääl m
return
ãã 
userId
ãã 
;
ãã 
}
åå 
private
éé 
string
éé  
GetCurrentUserRole
éé %
(
éé% &
)
éé& '
{
èè 
var
êê 
	roleClaim
êê 
=
êê 
User
êê 
.
êê 
	FindFirst
êê &
(
êê& '

ClaimTypes
êê' 1
.
êê1 2
Role
êê2 6
)
êê6 7
;
êê7 8
if
ëë 

(
ëë 
	roleClaim
ëë 
is
ëë 
null
ëë 
||
ëë  
string
ëë! '
.
ëë' ( 
IsNullOrWhiteSpace
ëë( :
(
ëë: ;
	roleClaim
ëë; D
.
ëëD E
Value
ëëE J
)
ëëJ K
)
ëëK L
throw
íí 
new
íí 
Taskify
íí 
.
íí 
Business
íí &
.
íí& '

Exceptions
íí' 1
.
íí1 2%
AuthenticationException
íí2 I
(
ííI J
$str
ííJ z
)
ííz {
;
íí{ |
return
ìì 
	roleClaim
ìì 
.
ìì 
Value
ìì 
;
ìì 
}
îî 
}ïï Õ1
~C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Controllers\ProfileController.cs
	namespace 	
Taskify
 
. 
API 
. 
Controllers !
;! "
[		 
ApiController		 
]		 
[

 
Route

 
(

 
$str

 
)

 
]

 
[ 
	Authorize 

]
 
public 
class 
ProfileController 
:  
ControllerBase! /
{ 
private 
readonly 
IProfileService $
_profileService% 4
;4 5
public 

ProfileController 
( 
IProfileService ,
profileService- ;
); <
{ 
_profileService 
= 
profileService (
;( )
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $

GetProfile% /
(/ 0
)0 1
{ 
var 
userId 
= 
GetCurrentUserId %
(% &
)& '
;' (
var 
response 
= 
await 
_profileService ,
., -
GetProfileAsync- <
(< =
userId= C
)C D
;D E
return 
Ok 
( 
new 
{ 	
success 
= 
true 
, 
message   
=   
$str   7
,  7 8
data!! 
=!! 
response!! 
}"" 	
)""	 

;""
 
}## 
[&& 
HttpPut&& 
(&& 
$str&& 
)&& 
]&& 
public'' 

async'' 
Task'' 
<'' 
IActionResult'' #
>''# $
UpdateFullName''% 3
(''3 4
[(( 	
FromBody((	 
](( !
UpdateFullNameRequest(( (
request(() 0
)((0 1
{)) 
var** 
userId** 
=** 
GetCurrentUserId** %
(**% &
)**& '
;**' (
await,, 
_profileService,, 
.,, 
UpdateFullNameAsync,, 1
(,,1 2
userId-- 
,-- 
request.. 
).. 
;.. 
return00 
Ok00 
(00 
new00 
{11 	
success22 
=22 
true22 
,22 
message33 
=33 
$str33 7
}44 	
)44	 

;44
 
}55 
[88 
HttpPut88 
(88 
$str88 
)88 
]88 
public99 

async99 
Task99 
<99 
IActionResult99 #
>99# $
ChangePassword99% 3
(993 4
[:: 	
FromBody::	 
]:: !
ChangePasswordRequest:: (
request::) 0
)::0 1
{;; 
var<< 
userId<< 
=<< 
GetCurrentUserId<< %
(<<% &
)<<& '
;<<' (
await>> 
_profileService>> 
.>> 
ChangePasswordAsync>> 1
(>>1 2
userId?? 
,?? 
request@@ 
)@@ 
;@@ 
returnBB 
OkBB 
(BB 
newBB 
{CC 	
successDD 
=DD 
trueDD 
,DD 
messageEE 
=EE 
$strEE 6
}FF 	
)FF	 

;FF
 
}GG 
[JJ 
	HttpPatchJJ 
(JJ 
$strJJ 
)JJ 
]JJ 
publicKK 

asyncKK 
TaskKK 
<KK 
IActionResultKK #
>KK# $
DeactivateAccountKK% 6
(KK6 7
)KK7 8
{LL 
varMM 
userIdMM 
=MM 
GetCurrentUserIdMM %
(MM% &
)MM& '
;MM' (
awaitOO 
_profileServiceOO 
.OO "
DeactivateAccountAsyncOO 4
(OO4 5
userIdOO5 ;
)OO; <
;OO< =
returnQQ 
OkQQ 
(QQ 
newQQ 
{RR 	
successSS 
=SS 
trueSS 
,SS 
messageTT 
=TT 
$strTT 9
}UU 	
)UU	 

;UU
 
}VV 
[YY 

HttpDeleteYY 
]YY 
publicZZ 

asyncZZ 
TaskZZ 
<ZZ 
IActionResultZZ #
>ZZ# $
DeleteAccountZZ% 2
(ZZ2 3
)ZZ3 4
{[[ 
var\\ 
userId\\ 
=\\ 
GetCurrentUserId\\ %
(\\% &
)\\& '
;\\' (
await^^ 
_profileService^^ 
.^^ 
DeleteAccountAsync^^ 0
(^^0 1
userId^^1 7
)^^7 8
;^^8 9
return`` 
Ok`` 
(`` 
new`` 
{aa 	
successbb 
=bb 
truebb 
,bb 
messagecc 
=cc 
$strcc 5
}dd 	
)dd	 

;dd
 
}ee 
privategg 
intgg 
GetCurrentUserIdgg  
(gg  !
)gg! "
{hh 
varii 
userIdClaimii 
=ii 
Userii 
.ii 
	FindFirstii (
(ii( )

ClaimTypesjj 
.jj 
NameIdentifierjj %
)jj% &
?jj& '
.jj' (
Valuejj( -
;jj- .
ifll 

(ll 
!ll 
intll 
.ll 
TryParsell 
(ll 
userIdClaimll %
,ll% &
outll' *
varll+ .
userIdll/ 5
)ll5 6
)ll6 7
{mm 	
thrownn 
newnn '
UnauthorizedAccessExceptionnn 1
(nn1 2
$stroo -
)oo- .
;oo. /
}pp 	
returnrr 
userIdrr 
;rr 
}ss 
}tt È-
ÄC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Controllers\DashboardController.cs
	namespace 	
Taskify
 
. 
API 
. 
Controllers !
;! "
[ 
ApiController 
] 
[		 
Route		 
(		 
$str		 
)		 
]		 
[

 
	Authorize

 

(


 
Roles

 
=

 
$str

 
)

 
]

 
public 
class 
DashboardController  
:! "
ControllerBase# 1
{ 
private 
readonly 
ITaskService !
_taskService" .
;. /
public 

DashboardController 
( 
ITaskService +
taskService, 7
)7 8
{ 
_taskService 
= 
taskService "
;" #
} 
[!! 
HttpGet!! 
(!! 
$str!! 
)!! 
]!! 
public"" 

async"" 
Task"" 
<"" 
IActionResult"" #
>""# $
GetOverview""% 0
(""0 1
)""1 2
{## 
var$$ 
adminUserId$$ 
=$$ 
GetCurrentUserId$$ *
($$* +
)$$+ ,
;$$, -
var%% 
	adminRole%% 
=%% 
GetCurrentUserRole%% *
(%%* +
)%%+ ,
;%%, -
var'' 

statistics'' 
='' 
await'' 
_taskService'' +
.''+ ,'
GetAdminTaskStatisticsAsync'', G
(''G H
adminUserId(( 
,(( 
	adminRole)) 
))) 
;)) 
return++ 
Ok++ 
(++ 
new++ 
{,, 	
success-- 
=-- 
true-- 
,-- 
data.. 
=.. 

statistics.. 
}// 	
)//	 

;//
 
}00 
[;; 
HttpGet;; 
(;; 
$str;; 
);; 
];; 
public<< 

async<< 
Task<< 
<<< 
IActionResult<< #
><<# $
GetRecentTasks<<% 3
(<<3 4
[== 	
	FromQuery==	 
]== 
int== 
pageSize==  
===! "
$num==# $
)==$ %
{>> 
if?? 

(?? 
pageSize?? 
<?? 
$num?? 
||?? 
pageSize?? $
>??% &
$num??' )
)??) *
{@@ 	
returnAA 

BadRequestAA 
(AA 
newAA !
{BB 
successCC 
=CC 
falseCC 
,CC  
messageDD 
=DD 
$strDD ?
}EE 
)EE 
;EE 
}FF 	
varHH 
adminUserIdHH 
=HH 
GetCurrentUserIdHH *
(HH* +
)HH+ ,
;HH, -
varII 
	adminRoleII 
=II 
GetCurrentUserRoleII *
(II* +
)II+ ,
;II, -
varKK 
resultKK 
=KK 
awaitKK 
_taskServiceKK '
.KK' (
GetAdminTasksAsyncKK( :
(KK: ;
$numLL 
,LL 
pageSizeMM 
,MM 
adminUserIdNN 
,NN 
	adminRoleOO 
)OO 
;OO 
returnQQ 
OkQQ 
(QQ 
newQQ 
{RR 	
successSS 
=SS 
trueSS 
,SS 
dataTT 
=TT 
resultTT 
}UU 	
)UU	 

;UU
 
}VV 
private\\ 
int\\ 
GetCurrentUserId\\  
(\\  !
)\\! "
{]] 
var^^ 
userIdClaim^^ 
=^^ 
User^^ 
.^^ 
	FindFirst^^ (
(^^( )

ClaimTypes^^) 3
.^^3 4
NameIdentifier^^4 B
)^^B C
;^^C D
if`` 

(`` 
userIdClaim`` 
is`` 
null`` 
||``  "
!aa 
intaa 
.aa 
TryParseaa 
(aa 
userIdClaimaa %
.aa% &
Valueaa& +
,aa+ ,
outaa- 0
varaa1 4
userIdaa5 ;
)aa; <
)aa< =
{bb 	
throwcc 
newcc 
Taskifycc 
.cc 
Businesscc &
.cc& '

Exceptionscc' 1
.cc1 2#
AuthenticationExceptioncc2 I
(ccI J
$strdd 1
)dd1 2
;dd2 3
}ee 	
returngg 
userIdgg 
;gg 
}hh 
privatejj 
stringjj 
GetCurrentUserRolejj %
(jj% &
)jj& '
{kk 
varll 
	roleClaimll 
=ll 
Userll 
.ll 
	FindFirstll &
(ll& '

ClaimTypesll' 1
.ll1 2
Rolell2 6
)ll6 7
;ll7 8
ifnn 

(nn 
	roleClaimnn 
isnn 
nullnn 
||nn  
stringoo 
.oo 
IsNullOrWhiteSpaceoo %
(oo% &
	roleClaimoo& /
.oo/ 0
Valueoo0 5
)oo5 6
)oo6 7
{pp 	
throwqq 
newqq 
Taskifyqq 
.qq 
Businessqq &
.qq& '

Exceptionsqq' 1
.qq1 2#
AuthenticationExceptionqq2 I
(qqI J
$strrr @
)rr@ A
;rrA B
}ss 	
returnuu 
	roleClaimuu 
.uu 
Valueuu 
;uu 
}vv 
}ww Ω3
|C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.API\Controllers\AuthControllers.cs
	namespace 	
Taskify
 
. 
API 
. 
Controllers !
;! "
[

 
ApiController

 
]

 
[ 
Route 
( 
$str 
) 
] 
public 
class 
AuthController 
: 
ControllerBase ,
{ 
private 
readonly 
IAuthService !
_authService" .
;. /
public 

AuthController 
( 
IAuthService &
authService' 2
)2 3
{ 
_authService 
= 
authService "
;" #
} 
[ 
HttpPost 
( 
$str 
) 
] 
[ 
AllowAnonymous 
] 
public 

async 
Task 
< 
IActionResult #
># $
Register% -
(- .
[ 	
FromBody	 
] 
RegisterRequest "
request# *
)* +
{ 
var 
response 
= 
await 
_authService )
.) *
RegisterAsync* 7
(7 8
request8 ?
)? @
;@ A
return 

StatusCode 
( 
StatusCodes 
. 
Status201Created (
,( )
new 
{ 
success   
=   
true   
,   
message!! 
=!! 
$str!! 4
,!!4 5
data"" 
="" 
response"" 
}## 
)## 
;## 
}$$ 
[&& 
HttpPost&& 
(&& 
$str&& 
)&& 
]&& 
['' 
AllowAnonymous'' 
]'' 
public(( 

async(( 
Task(( 
<(( 
IActionResult(( #
>((# $
Login((% *
(((* +
[)) 	
FromBody))	 
])) 
LoginRequest)) 
request))  '
)))' (
{** 
var++ 
response++ 
=++ 
await++ 
_authService++ )
.++) *

LoginAsync++* 4
(++4 5
request++5 <
)++< =
;++= >
return-- 
Ok-- 
(-- 
new-- 
{.. 	
success// 
=// 
true// 
,// 
message00 
=00 
$str00 )
,00) *
data11 
=11 
response11 
}22 	
)22	 

;22
 
}33 
[55 
HttpPost55 
(55 
$str55 
)55 
]55 
[66 
	Authorize66 
]66 
public77 

async77 
Task77 
<77 
IActionResult77 #
>77# $
Logout77% +
(77+ ,
)77, -
{88 
var99 
tokenIdClaim99 
=99 
User99 
.99  
	FindFirst99  )
(99) *#
JwtRegisteredClaimNames:: #
.::# $
Jti::$ '
)::' (
?::( )
.::) *
Value::* /
;::/ 0
if<< 

(<< 
!<< 
Guid<< 
.<< 
TryParse<< 
(<< 
tokenIdClaim<< '
,<<' (
out<<) ,
var<<- 0
tokenId<<1 8
)<<8 9
)<<9 :
{== 	
return>> 
Unauthorized>> 
(>>  
new>>  #
{?? 
success@@ 
=@@ 
false@@ 
,@@  
messageAA 
=AA 
$strAA ;
}BB 
)BB 
;BB 
}CC 	
awaitEE 
_authServiceEE 
.EE 
LogoutAsyncEE &
(EE& '
tokenIdEE' .
)EE. /
;EE/ 0
returnGG 
OkGG 
(GG 
newGG 
{HH 	
successII 
=II 
trueII 
,II 
messageJJ 
=JJ 
$strJJ *
}KK 	
)KK	 

;KK
 
}LL 
[MM 
HttpGetMM 
(MM 
$strMM 
)MM 
]MM 
[NN 
	AuthorizeNN 

]NN
 
publicOO 
asyncOO 
TaskOO 
<OO 
IActionResultOO 
>OO  
MeOO! #
(OO# $
)OO$ %
{PP 
varQQ 
userIdQQ 
=QQ 
UserQQ 
.QQ 
	FindFirstQQ 
(QQ  

ClaimTypesQQ  *
.QQ* +
NameIdentifierQQ+ 9
)QQ9 :
?QQ: ;
.QQ; <
ValueQQ< A
;QQA B
varRR 
emailRR 
=RR 
UserRR 
.RR 
	FindFirstRR 
(RR 

ClaimTypesRR )
.RR) *
EmailRR* /
)RR/ 0
?RR0 1
.RR1 2
ValueRR2 7
;RR7 8
varSS 
roleSS 
=SS 
UserSS 
.SS 
	FindFirstSS 
(SS 

ClaimTypesSS (
.SS( )
RoleSS) -
)SS- .
?SS. /
.SS/ 0
ValueSS0 5
;SS5 6
returnUU 

OkUU 
(UU 
newUU 
{VV 
successWW 
=WW 
trueWW 
,WW 
dataXX 
=XX 
newXX 
{YY 	
userIdZZ 
,ZZ 
email[[ 
,[[ 
role\\ 
}]] 	
}^^ 
)^^ 
;^^ 
}__ 
[aa 
HttpGetaa 
(aa 	
$straa	 
)aa 
]aa 
[bb 
	Authorizebb 

(bb
 
Rolesbb 
=bb 
$strbb 
)bb 
]bb 
publiccc 
IActionResultcc 
	AdminTestcc 
(cc 
)cc  
{dd 
returnee 

Okee 
(ee 
newee 
{ff 
successgg 
=gg 
truegg 
,gg 
messagehh 
=hh 
$strhh 3
}ii 
)ii 
;ii 
}jj 
}kk 