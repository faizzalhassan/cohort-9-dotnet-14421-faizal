Æ
óC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Validators\Tasks\UpdateTaskStatusRequestValidator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Validators %
.% &
Tasks& +
;+ ,
public 
class ,
 UpdateTaskStatusRequestValidator -
: 
AbstractValidator 
< #
UpdateTaskStatusRequest /
>/ 0
{ 
public		 
,
 UpdateTaskStatusRequestValidator		 +
(		+ ,
)		, -
{

 
RuleFor 
( 
x 
=> 
x 
. 
Status 
) 
. 
InclusiveBetween 
( 
$num 
,  
$num! "
)" #
;# $
} 
} ˘
ëC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Validators\Tasks\UpdateTaskRequestValidator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Validators %
.% &
Tasks& +
;+ ,
public 
class &
UpdateTaskRequestValidator '
: 
AbstractValidator 
< 
UpdateTaskRequest )
>) *
{ 
public		 
&
UpdateTaskRequestValidator		 %
(		% &
)		& '
{

 
RuleFor 
( 
x 
=> 
x 
. 
Title 
) 
. 
NotEmpty 
( 
) 
. 
MaximumLength 
( 
$num 
) 
;  
RuleFor 
( 
x 
=> 
x 
. 
Description "
)" #
. 
MaximumLength 
( 
$num 
)  
;  !
RuleFor 
( 
x 
=> 
x 
. 
Category 
)  
. 
NotEmpty 
( 
) 
. 
MaximumLength 
( 
$num 
) 
;  
RuleFor 
( 
x 
=> 
x 
. 
Priority 
)  
. 
InclusiveBetween 
( 
$num 
,  
$num! "
)" #
;# $
RuleFor 
( 
x 
=> 
x 
. 
DueDate 
) 
. 
Must 
( 
date 
=> 
date 
== !
null" &
||' )
date* .
.. /
Value/ 4
>=5 7
DateTime8 @
.@ A
UtcNowA G
)G H
. 
WithMessage 
( 
$str :
): ;
;; <
} 
} ˘
ëC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Validators\Tasks\CreateTaskRequestValidator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Validators %
.% &
Tasks& +
;+ ,
public 
class &
CreateTaskRequestValidator '
: 
AbstractValidator 
< 
CreateTaskRequest )
>) *
{ 
public		 
&
CreateTaskRequestValidator		 %
(		% &
)		& '
{

 
RuleFor 
( 
x 
=> 
x 
. 
Title 
) 
. 
NotEmpty 
( 
) 
. 
MaximumLength 
( 
$num 
) 
;  
RuleFor 
( 
x 
=> 
x 
. 
Description "
)" #
. 
MaximumLength 
( 
$num 
)  
;  !
RuleFor 
( 
x 
=> 
x 
. 
Category 
)  
. 
NotEmpty 
( 
) 
. 
MaximumLength 
( 
$num 
) 
;  
RuleFor 
( 
x 
=> 
x 
. 
Priority 
)  
. 
InclusiveBetween 
( 
$num 
,  
$num! "
)" #
;# $
RuleFor 
( 
x 
=> 
x 
. 
DueDate 
) 
. 
Must 
( 
date 
=> 
date 
== !
null" &
||' )
date* .
.. /
Value/ 4
>=5 7
DateTime8 @
.@ A
UtcNowA G
)G H
. 
WithMessage 
( 
$str :
): ;
;; <
} 
} ¬$
âC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Validators\RegisterRequestValidator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Validators %
;% &
public 
class $
RegisterRequestValidator %
:& '
AbstractValidator( 9
<9 :
RegisterRequest: I
>I J
{ 
public 
$
RegisterRequestValidator #
(# $
)$ %
{		 
RuleFor

 
(

 
request

 
=>

 
request

 "
.

" #
	FirstName

# ,
)

, -
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 2
)2 3
. 
Must 
( 
value 
=> 
! 
string "
." #
IsNullOrWhiteSpace# 5
(5 6
value6 ;
); <
)< =
. 
WithMessage 
( 
$str A
)A B
. 
Length 
( 
$num 
, 
$num 
) 
. 
WithMessage 
( 
$str J
)J K
;K L
RuleFor 
( 
request 
=> 
request "
." #
LastName# +
)+ ,
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 1
)1 2
. 
Must 
( 
value 
=> 
! 
string "
." #
IsNullOrWhiteSpace# 5
(5 6
value6 ;
); <
)< =
. 
WithMessage 
( 
$str @
)@ A
. 
Length 
( 
$num 
, 
$num 
) 
. 
WithMessage 
( 
$str I
)I J
;J K
RuleFor 
( 
request 
=> 
request "
." #
Email# (
)( )
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str -
)- .
. 
EmailAddress 
( 
) 
. 
WithMessage 
( 
$str >
)> ?
. 
MaximumLength 
( 
$num 
) 
.   
WithMessage   
(   
$str   >
)  > ?
;  ? @
RuleFor"" 
("" 
request"" 
=>"" 
request"" "
.""" #
Password""# +
)""+ ,
.## 
NotEmpty## 
(## 
)## 
.$$ 
WithMessage$$ 
($$ 
$str$$ 0
)$$0 1
.%% 
MinimumLength%% 
(%% 
$num%% 
)%% 
.&& 
WithMessage&& 
(&& 
$str&& G
)&&G H
.'' 
Matches'' 
('' 
$str'' 
)'' 
.(( 
WithMessage(( 
((( 
$str(( O
)((O P
.)) 
Matches)) 
()) 
$str)) 
))) 
.** 
WithMessage** 
(** 
$str** O
)**O P
.++ 
Matches++ 
(++ 
$str++ 
)++ 
.,, 
WithMessage,, 
(,, 
$str,, E
),,E F
.-- 
Matches-- 
(-- 
$str-- $
)--$ %
... 
WithMessage.. 
(.. 
$str.. P
)..P Q
;..Q R
RuleFor00 
(00 
request00 
=>00 
request00 "
.00" #
ConfirmPassword00# 2
)002 3
.11 
NotEmpty11 
(11 
)11 
.22 
WithMessage22 
(22 
$str22 8
)228 9
.33 
Equal33 
(33 
request33 
=>33 
request33 %
.33% &
Password33& .
)33. /
.44 
WithMessage44 
(44 
$str44 2
)442 3
;443 4
}55 
}66 è
ÜC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Validators\LoginRequestValidator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Validators %
;% &
public 
class !
LoginRequestValidator "
:# $
AbstractValidator% 6
<6 7
LoginRequest7 C
>C D
{ 
public 
!
LoginRequestValidator  
(  !
)! "
{		 
RuleFor

 
(

 
request

 
=>

 
request

 "
.

" #
Email

# (
)

( )
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str -
)- .
. 
EmailAddress 
( 
) 
. 
WithMessage 
( 
$str >
)> ?
. 
MaximumLength 
( 
$num 
) 
. 
WithMessage 
( 
$str >
)> ?
;? @
RuleFor 
( 
request 
=> 
request "
." #
Password# +
)+ ,
. 
NotEmpty 
( 
) 
. 
WithMessage 
( 
$str 0
)0 1
;1 2
} 
} ≥:
ÑC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Services\UserManagementService.cs
	namespace 	
Taskify
 
. 
Business 
. 
Services #
;# $
public 
class !
UserManagementService "
:# $"
IUserManagementService% ;
{		 
private

 
readonly

 
IUserRepository

 $
_userRepository

% 4
;

4 5
public 
!
UserManagementService  
(  !
IUserRepository 
userRepository &
)& '
{ 
_userRepository 
= 
userRepository (
;( )
} 
public 

async 
Task 
< 
IReadOnlyList #
<# $
AdminUserResponse$ 5
>5 6
>6 7
GetAllUsersAsync 
( 
int 
currentAdminId +
)+ ,
{ 
var 
users 
= 
await 
_userRepository )
.) *"
GetAllActiveUsersAsync* @
(@ A
)A B
;B C
var 
response 
= 
new 
List 
<  
AdminUserResponse  1
>1 2
(2 3
)3 4
;4 5
foreach 
( 
var 
user 
in 
users "
)" #
{ 	
var 
	taskCount 
= 
await 
_userRepository %
.% &
GetTaskCountAsync& 7
(7 8
user8 <
.< =
Id= ?
)? @
;@ A
response 
. 
Add 
( 
new 
AdminUserResponse .
{ 
Id   
=   
user   
.   
Id   
,   
	FirstName!! 
=!! 
user!!  
.!!  !
	FirstName!!! *
,!!* +
LastName"" 
="" 
user"" 
.""  
LastName""  (
,""( )
Email## 
=## 
user## 
.## 
Email## "
,##" #
Role$$ 
=$$ 
user$$ 
.$$ 
Role$$  
.$$  !
ToString$$! )
($$) *
)$$* +
,$$+ ,
IsActive%% 
=%% 
user%% 
.%%  
IsActive%%  (
,%%( )
	TaskCount&& 
=&& 
	taskCount&& %
,&&% &
	CreatedAt'' 
='' 
user''  
.''  !
	CreatedAt''! *
,''* +
LastLoginAt(( 
=(( 
user(( "
.((" #
LastLoginAt((# .
})) 
))) 
;)) 
}** 	
return,, 
response,, 
;,, 
}-- 
public// 

async// 
Task// 
ActivateUserAsync// '
(//' (
int00 
userId00 
,00 
int11 
currentAdminId11 
)11 
{22 
var33 
user33 
=33 
await33 %
GetUserForManagementAsync33 2
(332 3
userId333 9
)339 :
;33: ;
if55 

(55 
user55 
.55 
Id55 
==55 
currentAdminId55 %
)55% &
{66 	
throw77 
new77 
ConflictException77 '
(77' (
$str88 C
)88C D
;88D E
}99 	
user;; 
.;; 
IsActive;; 
=;; 
true;; 
;;; 
user<< 
.<< 
	UpdatedAt<< 
=<< 
DateTime<< !
.<<! "
UtcNow<<" (
;<<( )
await>> 
_userRepository>> 
.>> 
UpdateAsync>> )
(>>) *
user>>* .
)>>. /
;>>/ 0
}?? 
publicAA 

asyncAA 
TaskAA 
DeactivateUserAsyncAA )
(AA) *
intBB 
userIdBB 
,BB 
intCC 
currentAdminIdCC 
)CC 
{DD 
varEE 
userEE 
=EE 
awaitEE %
GetUserForManagementAsyncEE 2
(EE2 3
userIdEE3 9
)EE9 :
;EE: ;
ifGG 

(GG 
userGG 
.GG 
IdGG 
==GG 
currentAdminIdGG %
)GG% &
{HH 	
throwII 
newII 
ConflictExceptionII '
(II' (
$strJJ 9
)JJ9 :
;JJ: ;
}KK 	
userMM 
.MM 
IsActiveMM 
=MM 
falseMM 
;MM 
userNN 
.NN 
	UpdatedAtNN 
=NN 
DateTimeNN !
.NN! "
UtcNowNN" (
;NN( )
awaitPP 
_userRepositoryPP 
.PP 
UpdateAsyncPP )
(PP) *
userPP* .
)PP. /
;PP/ 0
}QQ 
publicSS 

asyncSS 
TaskSS 
DeleteUserAsyncSS %
(SS% &
intTT 
userIdTT 
,TT 
intUU 
currentAdminIdUU 
)UU 
{VV 
varWW 
userWW 
=WW 
awaitWW %
GetUserForManagementAsyncWW 2
(WW2 3
userIdWW3 9
)WW9 :
;WW: ;
ifYY 

(YY 
userYY 
.YY 
IdYY 
==YY 
currentAdminIdYY %
)YY% &
{ZZ 	
throw[[ 
new[[ 
ConflictException[[ '
([[' (
$str\\ 5
)\\5 6
;\\6 7
}]] 	
user__ 
.__ 
	IsDeleted__ 
=__ 
true__ 
;__ 
user`` 
.`` 
IsActive`` 
=`` 
false`` 
;`` 
useraa 
.aa 
	UpdatedAtaa 
=aa 
DateTimeaa !
.aa! "
UtcNowaa" (
;aa( )
awaitcc 
_userRepositorycc 
.cc 
UpdateAsynccc )
(cc) *
usercc* .
)cc. /
;cc/ 0
}dd 
privateff 
asyncff 
Taskff 
<ff 
Taskifyff 
.ff 

Repositoryff )
.ff) *
Entitiesff* 2
.ff2 3
Userff3 7
>ff7 8%
GetUserForManagementAsyncgg !
(gg! "
intgg" %
userIdgg& ,
)gg, -
{hh 
varii 
userii 
=ii 
awaitii 
_userRepositoryii (
.ii( )
GetByIdAsyncii) 5
(ii5 6
userIdii6 <
)ii< =
;ii= >
ifkk 

(kk 
userkk 
iskk 
nullkk 
||kk 
userkk  
.kk  !
	IsDeletedkk! *
)kk* +
{ll 	
throwmm 
newmm 
NotFoundExceptionmm '
(mm' (
$strnn !
)nn! "
;nn" #
}oo 	
returnqq 
userqq 
;qq 
}rr 
}ss ôm
}C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Services\ProfileService.cs
	namespace 	
Taskify
 
. 
Business 
. 
Services #
;# $
public

 
class

 
ProfileService

 
:

 
IProfileService

 -
{ 
private 
readonly 
IUserRepository $
_userRepository% 4
;4 5
private 
readonly "
IUserSessionRepository +
_sessionRepository, >
;> ?
private 
readonly 
IPasswordHasher $
<$ %
User% )
>) *
_passwordHasher+ :
;: ;
public 

ProfileService 
( 
IUserRepository 
userRepository &
,& '"
IUserSessionRepository 
sessionRepository 0
,0 1
IPasswordHasher 
< 
User 
> 
passwordHasher ,
), -
{ 
_userRepository 
= 
userRepository (
;( )
_sessionRepository 
= 
sessionRepository .
;. /
_passwordHasher 
= 
passwordHasher (
;( )
} 
public 

async 
Task 
< 
ProfileResponse %
>% &
GetProfileAsync' 6
(6 7
int7 :
userId; A
)A B
{ 
var 
user 
= 
await 
_userRepository (
.( )
GetByIdAsync) 5
(5 6
userId6 <
)< =
;= >
if 

( 
user 
is 
null 
|| 
user  
.  !
	IsDeleted! *
)* +
{ 	
throw   
new   
NotFoundException   '
(  ' (
$str!! -
)!!- .
;!!. /
}"" 	
return$$ 
new$$ 
ProfileResponse$$ "
{%% 	
Id&& 
=&& 
user&& 
.&& 
Id&& 
,&& 
FullName'' 
='' 
$"'' 
{'' 
user'' 
.'' 
	FirstName'' (
}''( )
$str'') *
{''* +
user''+ /
.''/ 0
LastName''0 8
}''8 9
"''9 :
.'': ;
Trim''; ?
(''? @
)''@ A
,''A B
Email(( 
=(( 
user(( 
.(( 
Email(( 
,(( 
Role)) 
=)) 
user)) 
.)) 
Role)) 
.)) 
ToString)) %
())% &
)))& '
,))' (
AccountCreatedOn** 
=** 
user** #
.**# $
	CreatedAt**$ -
,**- .
IsActive++ 
=++ 
user++ 
.++ 
IsActive++ $
},, 	
;,,	 

}-- 
public// 

async// 
Task// 
UpdateFullNameAsync// )
(//) *
int00 
userId00 
,00 !
UpdateFullNameRequest11 
request11 %
)11% &
{22 
if33 

(33 
string33 
.33 
IsNullOrWhiteSpace33 %
(33% &
request33& -
.33- .
FullName33. 6
)336 7
)337 8
{44 	
throw55 
new55 
ValidationException55 )
(55) *
new66 

Dictionary66 
<66 
string66 %
,66% &
string66' -
[66- .
]66. /
>66/ 0
{77 
[88 
$str88 
]88  
=88! "
[99 
$str99 -
]99- .
}:: 
):: 
;:: 
};; 	
var== 
fullName== 
=== 
request== 
.== 
FullName== '
.==' (
Trim==( ,
(==, -
)==- .
;==. /
var?? 
	nameParts?? 
=?? 
fullName??  
.@@ 
Split@@ 
(@@ 
$charAA 
,AA 
StringSplitOptionsBB "
.BB" #
RemoveEmptyEntriesBB# 5
)BB5 6
;BB6 7
ifDD 

(DD 
	namePartsDD 
.DD 
LengthDD 
<DD 
$numDD  
)DD  !
{EE 	
throwFF 
newFF 
ValidationExceptionFF )
(FF) *
newGG 

DictionaryGG 
<GG 
stringGG %
,GG% &
stringGG' -
[GG- .
]GG. /
>GG/ 0
{HH 
[II 
$strII 
]II  
=II! "
[JJ 
$strJJ D
]JJD E
}KK 
)KK 
;KK 
}LL 	
varNN 
userNN 
=NN 
awaitNN 
_userRepositoryNN (
.NN( )
GetByIdAsyncNN) 5
(NN5 6
userIdNN6 <
)NN< =
;NN= >
ifPP 

(PP 
userPP 
isPP 
nullPP 
||PP 
userPP  
.PP  !
	IsDeletedPP! *
)PP* +
{QQ 	
throwRR 
newRR 
NotFoundExceptionRR '
(RR' (
$strSS -
)SS- .
;SS. /
}TT 	
userVV 
.VV 
	FirstNameVV 
=VV 
	namePartsVV "
[VV" #
$numVV# $
]VV$ %
;VV% &
userXX 
.XX 
LastNameXX 
=XX 
stringXX 
.XX 
JoinXX #
(XX# $
$strYY 
,YY 
	namePartsZZ 
.ZZ 
SkipZZ 
(ZZ 
$numZZ 
)ZZ 
)ZZ 
;ZZ 
user\\ 
.\\ 
	UpdatedAt\\ 
=\\ 
DateTime\\ !
.\\! "
UtcNow\\" (
;\\( )
await^^ 
_userRepository^^ 
.^^ 
UpdateAsync^^ )
(^^) *
user^^* .
)^^. /
;^^/ 0
}__ 
publicaa 

asyncaa 
Taskaa 
ChangePasswordAsyncaa )
(aa) *
intbb 
userIdbb 
,bb !
ChangePasswordRequestcc 
requestcc %
)cc% &
{dd 
ifee 

(ee 
stringee 
.ee 
IsNullOrWhiteSpaceee %
(ee% &
requestee& -
.ee- .
CurrentPasswordee. =
)ee= >
)ee> ?
{ff 	
throwgg 
newgg 
ValidationExceptiongg )
(gg) *
newhh 

Dictionaryhh 
<hh 
stringhh %
,hh% &
stringhh' -
[hh- .
]hh. /
>hh/ 0
{ii 
[jj 
$strjj &
]jj& '
=jj( )
[kk 
$strkk 4
]kk4 5
}ll 
)ll 
;ll 
}mm 	
ifoo 

(oo 
stringoo 
.oo 
IsNullOrWhiteSpaceoo %
(oo% &
requestoo& -
.oo- .
NewPasswordoo. 9
)oo9 :
)oo: ;
{pp 	
throwqq 
newqq 
ValidationExceptionqq )
(qq) *
newrr 

Dictionaryrr 
<rr 
stringrr %
,rr% &
stringrr' -
[rr- .
]rr. /
>rr/ 0
{ss 
[tt 
$strtt "
]tt" #
=tt$ %
[uu 
$struu 0
]uu0 1
}vv 
)vv 
;vv 
}ww 	
ifyy 

(yy 
requestyy 
.yy 
NewPasswordyy 
.yy  
Lengthyy  &
<yy' (
$numyy) *
)yy* +
{zz 	
throw{{ 
new{{ 
ValidationException{{ )
({{) *
new|| 

Dictionary|| 
<|| 
string|| %
,||% &
string||' -
[||- .
]||. /
>||/ 0
{}} 
[~~ 
$str~~ "
]~~" #
=~~$ %
[ 
$str G
]G H
}
ÄÄ 
)
ÄÄ 
;
ÄÄ 
}
ÅÅ 	
var
ÉÉ 
user
ÉÉ 
=
ÉÉ 
await
ÉÉ 
_userRepository
ÉÉ (
.
ÉÉ( )
GetByIdAsync
ÉÉ) 5
(
ÉÉ5 6
userId
ÉÉ6 <
)
ÉÉ< =
;
ÉÉ= >
if
ÖÖ 

(
ÖÖ 
user
ÖÖ 
is
ÖÖ 
null
ÖÖ 
||
ÖÖ 
user
ÖÖ  
.
ÖÖ  !
	IsDeleted
ÖÖ! *
)
ÖÖ* +
{
ÜÜ 	
throw
áá 
new
áá 
NotFoundException
áá '
(
áá' (
$str
àà -
)
àà- .
;
àà. /
}
ââ 	
var
ãã 
passwordResult
ãã 
=
ãã 
_passwordHasher
åå 
.
åå "
VerifyHashedPassword
åå 0
(
åå0 1
user
çç 
,
çç 
user
éé 
.
éé 
PasswordHash
éé !
,
éé! "
request
èè 
.
èè 
CurrentPassword
èè '
)
èè' (
;
èè( )
if
ëë 

(
ëë 
passwordResult
ëë 
==
ëë (
PasswordVerificationResult
íí &
.
íí& '
Failed
íí' -
)
íí- .
{
ìì 	
throw
îî 
new
îî %
AuthenticationException
îî -
(
îî- .
$str
ïï 0
)
ïï0 1
;
ïï1 2
}
ññ 	
user
òò 
.
òò 
PasswordHash
òò 
=
òò 
_passwordHasher
ôô 
.
ôô 
HashPassword
ôô (
(
ôô( )
user
öö 
,
öö 
request
õõ 
.
õõ 
NewPassword
õõ #
)
õõ# $
;
õõ$ %
user
ùù 
.
ùù 
	UpdatedAt
ùù 
=
ùù 
DateTime
ùù !
.
ùù! "
UtcNow
ùù" (
;
ùù( )
await
üü 
_userRepository
üü 
.
üü 
UpdateAsync
üü )
(
üü) *
user
üü* .
)
üü. /
;
üü/ 0
await
°°  
_sessionRepository
°°  
.
°°  !$
RevokeAllByUserIdAsync
°°! 7
(
°°7 8
userId
°°8 >
)
°°> ?
;
°°? @
}
¢¢ 
public
§§ 

async
§§ 
Task
§§ $
DeactivateAccountAsync
§§ ,
(
§§, -
int
§§- 0
userId
§§1 7
)
§§7 8
{
•• 
var
¶¶ 
user
¶¶ 
=
¶¶ 
await
¶¶ 
_userRepository
¶¶ (
.
¶¶( )
GetByIdAsync
¶¶) 5
(
¶¶5 6
userId
¶¶6 <
)
¶¶< =
;
¶¶= >
if
®® 

(
®® 
user
®® 
is
®® 
null
®® 
||
®® 
user
®®  
.
®®  !
	IsDeleted
®®! *
)
®®* +
{
©© 	
throw
™™ 
new
™™ 
NotFoundException
™™ '
(
™™' (
$str
´´ -
)
´´- .
;
´´. /
}
¨¨ 	
if
ÆÆ 

(
ÆÆ 
!
ÆÆ 
user
ÆÆ 
.
ÆÆ 
IsActive
ÆÆ 
)
ÆÆ 
{
ØØ 	
return
∞∞ 
;
∞∞ 
}
±± 	
user
≥≥ 
.
≥≥ 
IsActive
≥≥ 
=
≥≥ 
false
≥≥ 
;
≥≥ 
user
¥¥ 
.
¥¥ 
	UpdatedAt
¥¥ 
=
¥¥ 
DateTime
¥¥ !
.
¥¥! "
UtcNow
¥¥" (
;
¥¥( )
await
∂∂ 
_userRepository
∂∂ 
.
∂∂ 
UpdateAsync
∂∂ )
(
∂∂) *
user
∂∂* .
)
∂∂. /
;
∂∂/ 0
await
∏∏  
_sessionRepository
∏∏  
.
∏∏  !$
RevokeAllByUserIdAsync
∏∏! 7
(
∏∏7 8
userId
∏∏8 >
)
∏∏> ?
;
∏∏? @
}
ππ 
public
ªª 

async
ªª 
Task
ªª  
DeleteAccountAsync
ªª (
(
ªª( )
int
ªª) ,
userId
ªª- 3
)
ªª3 4
{
ºº 
var
ΩΩ 
user
ΩΩ 
=
ΩΩ 
await
ΩΩ 
_userRepository
ΩΩ (
.
ΩΩ( )
GetByIdAsync
ΩΩ) 5
(
ΩΩ5 6
userId
ΩΩ6 <
)
ΩΩ< =
;
ΩΩ= >
if
øø 

(
øø 
user
øø 
is
øø 
null
øø 
||
øø 
user
øø  
.
øø  !
	IsDeleted
øø! *
)
øø* +
{
¿¿ 	
throw
¡¡ 
new
¡¡ 
NotFoundException
¡¡ '
(
¡¡' (
$str
¬¬ -
)
¬¬- .
;
¬¬. /
}
√√ 	
user
≈≈ 
.
≈≈ 
IsActive
≈≈ 
=
≈≈ 
false
≈≈ 
;
≈≈ 
user
∆∆ 
.
∆∆ 
	IsDeleted
∆∆ 
=
∆∆ 
true
∆∆ 
;
∆∆ 
user
«« 
.
«« 
	UpdatedAt
«« 
=
«« 
DateTime
«« !
.
««! "
UtcNow
««" (
;
««( )
await
…… 
_userRepository
…… 
.
…… 
UpdateAsync
…… )
(
……) *
user
……* .
)
……. /
;
……/ 0
await
ÀÀ  
_sessionRepository
ÀÀ  
.
ÀÀ  !$
RevokeAllByUserIdAsync
ÀÀ! 7
(
ÀÀ7 8
userId
ÀÀ8 >
)
ÀÀ> ?
;
ÀÀ? @
}
ÃÃ 
}ÕÕ îÀ
zC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Services\TaskService.cs
	namespace 	
Taskify
 
. 
Business 
. 
Services #
;# $
public 
class 
TaskService 
: 
ITaskService '
{ 
private 
readonly 
ITaskRepository $
_taskRepository% 4
;4 5
private 
readonly 
IUserRepository $
_userRepository% 4
;4 5
private 
readonly 

IValidator 
<  
CreateTaskRequest  1
>1 2
_createValidator3 C
;C D
private 
readonly 

IValidator 
<  
UpdateTaskRequest  1
>1 2
_updateValidator3 C
;C D
private 
readonly 

IValidator 
<  #
UpdateTaskStatusRequest  7
>7 8
_statusValidator9 I
;I J
private 
const 
int 
DefaultPageSize %
=& '
$num( *
;* +
private 
const 
int 
MaxPageSize !
=" #
$num$ '
;' (
private 
const 
string 
	AdminRole "
=# $
$str% ,
;, -
public 

TaskService 
( 
ITaskRepository 
taskRepository &
,& '
IUserRepository 
userRepository &
,& '

IValidator 
< 
CreateTaskRequest $
>$ %
createValidator& 5
,5 6

IValidator 
< 
UpdateTaskRequest $
>$ %
updateValidator& 5
,5 6

IValidator   
<   #
UpdateTaskStatusRequest   *
>  * +
statusValidator  , ;
)  ; <
{!! 
_taskRepository"" 
="" 
taskRepository"" (
;""( )
_userRepository## 
=## 
userRepository## (
;##( )
_createValidator$$ 
=$$ 
createValidator$$ *
;$$* +
_updateValidator%% 
=%% 
updateValidator%% *
;%%* +
_statusValidator&& 
=&& 
statusValidator&& *
;&&* +
}'' 
public-- 

async-- 
Task-- 
<-- 
IReadOnlyList-- #
<--# $
UserAssignmentDto--$ 5
>--5 6
>--6 7&
GetUsersForAssignmentAsync--8 R
(--R S
)--S T
{.. 
var// 
users// 
=// 
await// 
_taskRepository// )
.//) *&
GetUsersForAssignmentAsync//* D
(//D E
)//E F
;//F G
return00 
users00 
.00 
Select00 
(00 
user00  
=>00! #
new00$ '
UserAssignmentDto00( 9
{11 	
Id22 
=22 
user22 
.22 
Id22 
,22 
FullName33 
=33 
$"33 
{33 
user33 
.33 
	FirstName33 (
}33( )
$str33) *
{33* +
user33+ /
.33/ 0
LastName330 8
}338 9
"339 :
.33: ;
Trim33; ?
(33? @
)33@ A
,33A B
Email44 
=44 
user44 
.44 
Email44 
}55 	
)55	 

.55
 
ToList55 
(55 
)55 
;55 
}66 
public<< 

async<< 
Task<< 
<<< 
TaskResponse<< "
><<" #
CreateTaskAsync<<$ 3
(<<3 4
CreateTaskRequest== 
request== !
,==! "
int>> 
currentUserId>> 
,>> 
string?? 
currentUserRole?? 
)?? 
{@@ 
awaitAA &
ValidateCreateRequestAsyncAA (
(AA( )
requestAA) 0
)AA0 1
;AA1 2
varCC 
isAdminCC 
=CC 
IsAdminCC 
(CC 
currentUserRoleCC -
)CC- .
;CC. /
varDD 
assignedToUserIdDD 
=DD #
DetermineAssignedUserIdDD 6
(DD6 7
requestDD7 >
,DD> ?
currentUserIdDD@ M
,DDM N
isAdminDDO V
)DDV W
;DDW X
awaitFF %
ValidateAssignedUserAsyncFF '
(FF' (
assignedToUserIdFF( 8
)FF8 9
;FF9 :
varHH 
taskHH 
=HH 
CreateTaskEntityHH #
(HH# $
requestHH$ +
,HH+ ,
currentUserIdHH- :
,HH: ;
assignedToUserIdHH< L
)HHL M
;HHM N
varII 
createdTaskII 
=II 
awaitII 
_taskRepositoryII  /
.II/ 0
AddAsyncII0 8
(II8 9
taskII9 =
)II= >
;II> ?
returnKK 
awaitKK  
GetTaskResponseAsyncKK )
(KK) *
createdTaskKK* 5
.KK5 6
IdKK6 8
)KK8 9
;KK9 :
}LL 
publicNN 

asyncNN 
TaskNN 
<NN 
IReadOnlyListNN #
<NN# $
TaskResponseNN$ 0
>NN0 1
>NN1 2
GetMyTasksAsyncNN3 B
(NNB C
intOO 
currentUserIdOO 
,OO 
stringPP 
currentUserRolePP 
)PP 
{QQ 
varRR 
tasksRR 
=RR 
awaitRR  
GetVisibleTasksAsyncRR .
(RR. /
currentUserIdRR/ <
,RR< =
currentUserRoleRR> M
)RRM N
;RRN O
returnSS 
tasksSS 
.SS 
SelectSS 
(SS 
MapToResponseSS )
)SS) *
.SS* +
ToListSS+ 1
(SS1 2
)SS2 3
;SS3 4
}TT 
publicVV 

asyncVV 
TaskVV 
<VV 
IReadOnlyListVV #
<VV# $
TaskResponseVV$ 0
>VV0 1
>VV1 2!
GetAssignedTasksAsyncVV3 H
(VVH I
intWW 
currentUserIdWW 
,WW 
stringXX 
currentUserRoleXX 
)XX 
{YY 
varZZ 
tasksZZ 
=ZZ 
awaitZZ 
_taskRepositoryZZ )
.ZZ) *-
!GetAdminAssignedTasksForUserAsyncZZ* K
(ZZK L
currentUserIdZZL Y
)ZZY Z
;ZZZ [
return[[ 
tasks[[ 
.[[ 
Select[[ 
([[ 
MapToResponse[[ )
)[[) *
.[[* +
ToList[[+ 1
([[1 2
)[[2 3
;[[3 4
}\\ 
public^^ 

async^^ 
Task^^ 
<^^ 
IReadOnlyList^^ #
<^^# $
TaskResponse^^$ 0
>^^0 1
>^^1 2 
GetPendingTasksAsync^^3 G
(^^G H
int__ 
currentUserId__ 
,__ 
string`` 
currentUserRole`` 
)`` 
{aa 
returnbb 
awaitbb !
GetTasksByStatusAsyncbb *
(bb* +
currentUserIdcc 
,cc 
currentUserRoledd 
,dd 
EntityTaskStatusee 
.ee 
Pendingee $
)ee$ %
;ee% &
}ff 
publichh 

asynchh 
Taskhh 
<hh 
IReadOnlyListhh #
<hh# $
TaskResponsehh$ 0
>hh0 1
>hh1 2#
GetInProgressTasksAsynchh3 J
(hhJ K
intii 
currentUserIdii 
,ii 
stringjj 
currentUserRolejj 
)jj 
{kk 
returnll 
awaitll !
GetTasksByStatusAsyncll *
(ll* +
currentUserIdmm 
,mm 
currentUserRolenn 
,nn 
EntityTaskStatusoo 
.oo 

InProgressoo '
)oo' (
;oo( )
}pp 
publicrr 

asyncrr 
Taskrr 
<rr 
IReadOnlyListrr #
<rr# $
TaskResponserr$ 0
>rr0 1
>rr1 2"
GetCompletedTasksAsyncrr3 I
(rrI J
intss 
currentUserIdss 
,ss 
stringtt 
currentUserRolett 
)tt 
{uu 
returnvv 
awaitvv !
GetTasksByStatusAsyncvv *
(vv* +
currentUserIdww 
,ww 
currentUserRolexx 
,xx 
EntityTaskStatusyy 
.yy 
	Completedyy &
)yy& '
;yy' (
}zz 
public|| 

async|| 
Task|| 
<|| 
IReadOnlyList|| #
<||# $
TaskResponse||$ 0
>||0 1
>||1 2"
GetCancelledTasksAsync||3 I
(||I J
int}} 
currentUserId}} 
,}} 
string~~ 
currentUserRole~~ 
)~~ 
{ 
return
ÄÄ 
await
ÄÄ #
GetTasksByStatusAsync
ÄÄ *
(
ÄÄ* +
currentUserId
ÅÅ 
,
ÅÅ 
currentUserRole
ÇÇ 
,
ÇÇ 
EntityTaskStatus
ÉÉ 
.
ÉÉ 
	Cancelled
ÉÉ &
)
ÉÉ& '
;
ÉÉ' (
}
ÑÑ 
public
ÜÜ 

async
ÜÜ 
Task
ÜÜ 
<
ÜÜ 
IReadOnlyList
ÜÜ #
<
ÜÜ# $
TaskResponse
ÜÜ$ 0
>
ÜÜ0 1
>
ÜÜ1 2"
GetOverdueTasksAsync
ÜÜ3 G
(
ÜÜG H
int
áá 
currentUserId
áá 
,
áá 
string
àà 
currentUserRole
àà 
)
àà 
{
ââ 
var
ää 
tasks
ää 
=
ää 
await
ää "
GetVisibleTasksAsync
ää .
(
ää. /
currentUserId
ää/ <
,
ää< =
currentUserRole
ää> M
)
ääM N
;
ääN O
var
ãã 
now
ãã 
=
ãã 
DateTime
ãã 
.
ãã 
UtcNow
ãã !
;
ãã! "
return
çç 
tasks
çç 
.
éé 
Where
éé 
(
éé 
t
éé 
=>
éé 
t
éé 
.
éé 
DueDate
éé !
.
éé! "
HasValue
éé" *
&&
éé+ -
t
èè 
.
èè 
DueDate
èè  
.
èè  !
Value
èè! &
<
èè' (
now
èè) ,
&&
èè- /
t
êê 
.
êê 
Status
êê 
!=
êê  "
EntityTaskStatus
êê# 3
.
êê3 4
	Completed
êê4 =
&&
êê> @
t
ëë 
.
ëë 
Status
ëë 
!=
ëë  "
EntityTaskStatus
ëë# 3
.
ëë3 4
	Cancelled
ëë4 =
)
ëë= >
.
íí 
Select
íí 
(
íí 
MapToResponse
íí !
)
íí! "
.
ìì 
ToList
ìì 
(
ìì 
)
ìì 
;
ìì 
}
îî 
public
ññ 

async
ññ 
Task
ññ 
<
ññ 
TaskResponse
ññ "
>
ññ" #
GetTaskByIdAsync
ññ$ 4
(
ññ4 5
int
óó 
id
óó 
,
óó 
int
òò 
currentUserId
òò 
,
òò 
string
ôô 
currentUserRole
ôô 
)
ôô 
{
öö 
var
õõ 
task
õõ 
=
õõ 
await
õõ !
GetTaskOrThrowAsync
õõ ,
(
õõ, -
id
õõ- /
)
õõ/ 0
;
õõ0 1
EnsureCanView
úú 
(
úú 
task
úú 
,
úú 
currentUserId
úú )
,
úú) *
currentUserRole
úú+ :
)
úú: ;
;
úú; <
return
ùù 
MapToResponse
ùù 
(
ùù 
task
ùù !
)
ùù! "
;
ùù" #
}
ûû 
public
†† 

async
†† 
Task
†† 
<
†† 
TaskResponse
†† "
>
††" #
UpdateTaskAsync
††$ 3
(
††3 4
int
°° 
id
°° 
,
°° 
UpdateTaskRequest
¢¢ 
request
¢¢ !
,
¢¢! "
int
££ 
currentUserId
££ 
,
££ 
string
§§ 
currentUserRole
§§ 
)
§§ 
{
•• 
await
¶¶ (
ValidateUpdateRequestAsync
¶¶ (
(
¶¶( )
request
¶¶) 0
)
¶¶0 1
;
¶¶1 2
var
®® 
task
®® 
=
®® 
await
®® !
GetTaskOrThrowAsync
®® ,
(
®®, -
id
®®- /
)
®®/ 0
;
®®0 1
EnsureCanModify
©© 
(
©© 
task
©© 
,
©© 
currentUserId
©© +
,
©©+ ,
currentUserRole
©©- <
)
©©< =
;
©©= >
var
´´ 
isAdmin
´´ 
=
´´ 
IsAdmin
´´ 
(
´´ 
currentUserRole
´´ -
)
´´- .
;
´´. /
UpdateTaskEntity
¨¨ 
(
¨¨ 
task
¨¨ 
,
¨¨ 
request
¨¨ &
)
¨¨& '
;
¨¨' (
if
ÆÆ 

(
ÆÆ 
isAdmin
ÆÆ 
)
ÆÆ 
{
ØØ 	
if
∞∞ 
(
∞∞ 
!
∞∞ 
request
∞∞ 
.
∞∞ 
AssignedToUserId
∞∞ )
.
∞∞) *
HasValue
∞∞* 2
)
∞∞2 3
{
±± 
throw
≤≤ 
new
≤≤ $
AppValidationException
≤≤ 0
(
≤≤0 1
new
≥≥ 

Dictionary
≥≥ "
<
≥≥" #
string
≥≥# )
,
≥≥) *
string
≥≥+ 1
[
≥≥1 2
]
≥≥2 3
>
≥≥3 4
{
¥¥ 
[
µµ 
$str
µµ +
]
µµ+ ,
=
µµ- .
new
µµ/ 2
[
µµ2 3
]
µµ3 4
{
µµ5 6
$str
µµ7 h
}
µµi j
}
∂∂ 
)
∂∂ 
;
∂∂ 
}
∑∑ 
await
∏∏ '
ValidateAssignedUserAsync
∏∏ +
(
∏∏+ ,
request
∏∏, 3
.
∏∏3 4
AssignedToUserId
∏∏4 D
)
∏∏D E
;
∏∏E F
task
ππ 
.
ππ 
AssignedToUserId
ππ !
=
ππ" #
request
ππ$ +
.
ππ+ ,
AssignedToUserId
ππ, <
;
ππ< =
}
∫∫ 	
task
ºº 
.
ºº 
	UpdatedAt
ºº 
=
ºº 
DateTime
ºº !
.
ºº! "
UtcNow
ºº" (
;
ºº( )
await
ΩΩ 
_taskRepository
ΩΩ 
.
ΩΩ 
UpdateAsync
ΩΩ )
(
ΩΩ) *
task
ΩΩ* .
)
ΩΩ. /
;
ΩΩ/ 0
return
øø 
await
øø "
GetTaskResponseAsync
øø )
(
øø) *
id
øø* ,
)
øø, -
;
øø- .
}
¿¿ 
public
¬¬ 

async
¬¬ 
Task
¬¬ 
<
¬¬ 
TaskResponse
¬¬ "
>
¬¬" #
ChangeStatusAsync
¬¬$ 5
(
¬¬5 6
int
√√ 
id
√√ 
,
√√ %
UpdateTaskStatusRequest
ƒƒ 
request
ƒƒ  '
,
ƒƒ' (
int
≈≈ 
currentUserId
≈≈ 
,
≈≈ 
string
∆∆ 
currentUserRole
∆∆ 
)
∆∆ 
{
«« 
await
»» (
ValidateStatusRequestAsync
»» (
(
»»( )
request
»») 0
)
»»0 1
;
»»1 2
var
   
task
   
=
   
await
   !
GetTaskOrThrowAsync
   ,
(
  , -
id
  - /
)
  / 0
;
  0 1#
EnsureCanChangeStatus
ÀÀ 
(
ÀÀ 
task
ÀÀ "
,
ÀÀ" #
currentUserId
ÀÀ$ 1
,
ÀÀ1 2
currentUserRole
ÀÀ3 B
)
ÀÀB C
;
ÀÀC D
task
ÕÕ 
.
ÕÕ 
Status
ÕÕ 
=
ÕÕ 
MapToTaskStatus
ÕÕ %
(
ÕÕ% &
request
ÕÕ& -
.
ÕÕ- .
Status
ÕÕ. 4
)
ÕÕ4 5
;
ÕÕ5 6
task
ŒŒ 
.
ŒŒ 
	UpdatedAt
ŒŒ 
=
ŒŒ 
DateTime
ŒŒ !
.
ŒŒ! "
UtcNow
ŒŒ" (
;
ŒŒ( )
await
–– 
_taskRepository
–– 
.
–– 
UpdateAsync
–– )
(
––) *
task
––* .
)
––. /
;
––/ 0
return
—— 
await
—— "
GetTaskResponseAsync
—— )
(
——) *
id
——* ,
)
——, -
;
——- .
}
““ 
public
‘‘ 

async
‘‘ 
Task
‘‘ 
DeleteTaskAsync
‘‘ %
(
‘‘% &
int
’’ 
id
’’ 
,
’’ 
int
÷÷ 
currentUserId
÷÷ 
,
÷÷ 
string
◊◊ 
currentUserRole
◊◊ 
)
◊◊ 
{
ÿÿ 
var
ŸŸ 
task
ŸŸ 
=
ŸŸ 
await
ŸŸ !
GetTaskOrThrowAsync
ŸŸ ,
(
ŸŸ, -
id
ŸŸ- /
)
ŸŸ/ 0
;
ŸŸ0 1
EnsureCanModify
⁄⁄ 
(
⁄⁄ 
task
⁄⁄ 
,
⁄⁄ 
currentUserId
⁄⁄ +
,
⁄⁄+ ,
currentUserRole
⁄⁄- <
)
⁄⁄< =
;
⁄⁄= >
await
€€ 
_taskRepository
€€ 
.
€€ 
DeleteAsync
€€ )
(
€€) *
task
€€* .
)
€€. /
;
€€/ 0
}
‹‹ 
public
‚‚ 

async
‚‚ 
Task
‚‚ 
<
‚‚ $
AdminTaskPagedResponse
‚‚ ,
>
‚‚, - 
GetAdminTasksAsync
‚‚. @
(
‚‚@ A
int
„„ 

pageNumber
„„ 
,
„„ 
int
‰‰ 
pageSize
‰‰ 
,
‰‰ 
int
ÂÂ 
adminUserId
ÂÂ 
,
ÂÂ 
string
ÊÊ 
currentUserRole
ÊÊ 
)
ÊÊ 
{
ÁÁ 
EnsureAdmin
ËË 
(
ËË 
adminUserId
ËË 
,
ËË  
currentUserRole
ËË! 0
)
ËË0 1
;
ËË1 2

pageNumber
ÍÍ 
=
ÍÍ 

pageNumber
ÍÍ 
<
ÍÍ  !
$num
ÍÍ" #
?
ÍÍ$ %
$num
ÍÍ& '
:
ÍÍ( )

pageNumber
ÍÍ* 4
;
ÍÍ4 5
pageSize
ÏÏ 
=
ÏÏ 
pageSize
ÏÏ 
switch
ÏÏ "
{
ÌÌ 	
<=
ÓÓ 
$num
ÓÓ 
=>
ÓÓ 
DefaultPageSize
ÓÓ #
,
ÓÓ# $
>
ÔÔ 
MaxPageSize
ÔÔ 
=>
ÔÔ 
MaxPageSize
ÔÔ (
,
ÔÔ( )
_
 
=>
 
pageSize
 
}
ÒÒ 	
;
ÒÒ	 

var
ÛÛ 
result
ÛÛ 
=
ÛÛ 
await
ÛÛ 
_taskRepository
ÛÛ *
.
ÛÛ* +
GetPagedAsync
ÛÛ+ 8
(
ÛÛ8 9

pageNumber
ÛÛ9 C
,
ÛÛC D
pageSize
ÛÛE M
)
ÛÛM N
;
ÛÛN O
var
ıı 

totalPages
ıı 
=
ıı 
result
ıı 
.
ıı  

TotalCount
ıı  *
==
ıı+ -
$num
ıı. /
?
ˆˆ 
$num
ˆˆ 
:
˜˜ 
(
˜˜ 
int
˜˜ 
)
˜˜ 
Math
˜˜ 
.
˜˜ 
Ceiling
˜˜ 
(
˜˜  
result
˜˜  &
.
˜˜& '

TotalCount
˜˜' 1
/
˜˜2 3
(
˜˜4 5
double
˜˜5 ;
)
˜˜; <
pageSize
˜˜< D
)
˜˜D E
;
˜˜E F
return
˘˘ 
new
˘˘ $
AdminTaskPagedResponse
˘˘ )
{
˙˙ 	
Items
˚˚ 
=
˚˚ 
result
˚˚ 
.
˚˚ 
Items
˚˚  
.
˚˚  !
Select
˚˚! '
(
˚˚' (
MapToResponse
˚˚( 5
)
˚˚5 6
.
˚˚6 7
ToList
˚˚7 =
(
˚˚= >
)
˚˚> ?
,
˚˚? @

PageNumber
¸¸ 
=
¸¸ 

pageNumber
¸¸ #
,
¸¸# $
PageSize
˝˝ 
=
˝˝ 
pageSize
˝˝ 
,
˝˝  

TotalCount
˛˛ 
=
˛˛ 
result
˛˛ 
.
˛˛  

TotalCount
˛˛  *
,
˛˛* +

TotalPages
ˇˇ 
=
ˇˇ 

totalPages
ˇˇ #
,
ˇˇ# $
HasPreviousPage
ÄÄ 
=
ÄÄ 

pageNumber
ÄÄ (
>
ÄÄ) *
$num
ÄÄ+ ,
,
ÄÄ, -
HasNextPage
ÅÅ 
=
ÅÅ 

pageNumber
ÅÅ $
<
ÅÅ% &

totalPages
ÅÅ' 1
}
ÇÇ 	
;
ÇÇ	 

}
ÉÉ 
public
ÖÖ 

async
ÖÖ 
Task
ÖÖ 
<
ÖÖ )
AdminTaskStatisticsResponse
ÖÖ 1
>
ÖÖ1 2)
GetAdminTaskStatisticsAsync
ÖÖ3 N
(
ÖÖN O
int
ÜÜ 
adminUserId
ÜÜ 
,
ÜÜ 
string
áá 
currentUserRole
áá 
)
áá 
{
àà 
EnsureAdmin
ââ 
(
ââ 
adminUserId
ââ 
,
ââ  
currentUserRole
ââ! 0
)
ââ0 1
;
ââ1 2
var
ãã 

statistics
ãã 
=
ãã 
await
ãã 
_taskRepository
ãã .
.
ãã. / 
GetStatisticsAsync
ãã/ A
(
ããA B
)
ããB C
;
ããC D
return
çç 
new
çç )
AdminTaskStatisticsResponse
çç .
{
éé 	
Pending
èè 
=
èè 

statistics
èè  
.
èè  !
Pending
èè! (
,
èè( )

InProgress
êê 
=
êê 

statistics
êê #
.
êê# $

InProgress
êê$ .
,
êê. /
	Completed
ëë 
=
ëë 

statistics
ëë "
.
ëë" #
	Completed
ëë# ,
,
ëë, -
	Cancelled
íí 
=
íí 

statistics
íí "
.
íí" #
	Cancelled
íí# ,
,
íí, -
Overdue
ìì 
=
ìì 

statistics
ìì  
.
ìì  !
Overdue
ìì! (
}
îî 	
;
îî	 

}
ïï 
public
óó 

async
óó 
Task
óó 
<
óó 
TaskResponse
óó "
>
óó" ##
GetAdminTaskByIdAsync
óó$ 9
(
óó9 :
int
òò 
id
òò 
,
òò 
int
ôô 
adminUserId
ôô 
,
ôô 
string
öö 
currentUserRole
öö 
)
öö 
{
õõ 
EnsureAdmin
úú 
(
úú 
adminUserId
úú 
,
úú  
currentUserRole
úú! 0
)
úú0 1
;
úú1 2
return
ùù 
await
ùù "
GetTaskResponseAsync
ùù )
(
ùù) *
id
ùù* ,
)
ùù, -
;
ùù- .
}
ûû 
public
†† 

async
†† 
Task
†† 
<
†† 
TaskResponse
†† "
>
††" #"
CreateAdminTaskAsync
††$ 8
(
††8 9
CreateTaskRequest
°° 
request
°° !
,
°°! "
int
¢¢ 
adminUserId
¢¢ 
,
¢¢ 
string
££ 
currentUserRole
££ 
)
££ 
{
§§ 
EnsureAdmin
•• 
(
•• 
adminUserId
•• 
,
••  
currentUserRole
••! 0
)
••0 1
;
••1 2
var
ßß 
validationResult
ßß 
=
ßß 
await
ßß $
_createValidator
ßß% 5
.
ßß5 6
ValidateAsync
ßß6 C
(
ßßC D
request
ßßD K
)
ßßK L
;
ßßL M
if
®® 

(
®® 
!
®® 
validationResult
®® 
.
®® 
IsValid
®® %
)
®®% &
throw
©© 
new
©© $
AppValidationException
©© ,
(
©©, -
validationResult
©©- =
.
©©= >
ToDictionary
©©> J
(
©©J K
)
©©K L
)
©©L M
;
©©M N
if
´´ 

(
´´ 
!
´´ 
request
´´ 
.
´´ 
AssignedToUserId
´´ %
.
´´% &
HasValue
´´& .
)
´´. /
{
¨¨ 	
throw
≠≠ 
new
≠≠ $
AppValidationException
≠≠ ,
(
≠≠, -
new
ÆÆ 

Dictionary
ÆÆ 
<
ÆÆ 
string
ÆÆ %
,
ÆÆ% &
string
ÆÆ' -
[
ÆÆ- .
]
ÆÆ. /
>
ÆÆ/ 0
{
ØØ 
[
∞∞ 
$str
∞∞ '
]
∞∞' (
=
∞∞) *
new
∞∞+ .
[
∞∞. /
]
∞∞/ 0
{
∞∞1 2
$str
∞∞3 j
}
∞∞k l
}
±± 
)
±± 
;
±± 
}
≤≤ 	
await
¥¥ '
ValidateAssignedUserAsync
¥¥ '
(
¥¥' (
request
¥¥( /
.
¥¥/ 0
AssignedToUserId
¥¥0 @
)
¥¥@ A
;
¥¥A B
var
∂∂ 
task
∂∂ 
=
∂∂ 
new
∂∂ 
TaskItem
∂∂ 
{
∑∑ 	
Title
∏∏ 
=
∏∏ 
request
∏∏ 
.
∏∏ 
Title
∏∏ !
.
∏∏! "
Trim
∏∏" &
(
∏∏& '
)
∏∏' (
,
∏∏( )
Description
ππ 
=
ππ 
request
ππ !
.
ππ! "
Description
ππ" -
?
ππ- .
.
ππ. /
Trim
ππ/ 3
(
ππ3 4
)
ππ4 5
,
ππ5 6
Category
∫∫ 
=
∫∫ 
request
∫∫ 
.
∫∫ 
Category
∫∫ '
.
∫∫' (
Trim
∫∫( ,
(
∫∫, -
)
∫∫- .
,
∫∫. /
Priority
ªª 
=
ªª 
(
ªª 
TaskPriority
ªª $
)
ªª$ %
request
ªª% ,
.
ªª, -
Priority
ªª- 5
,
ªª5 6
Status
ºº 
=
ºº 
EntityTaskStatus
ºº %
.
ºº% &
Pending
ºº& -
,
ºº- .
DueDate
ΩΩ 
=
ΩΩ 
request
ΩΩ 
.
ΩΩ 
DueDate
ΩΩ %
,
ΩΩ% &
	CreatedAt
ææ 
=
ææ 
DateTime
ææ  
.
ææ  !
UtcNow
ææ! '
,
ææ' (
	UpdatedAt
øø 
=
øø 
null
øø 
,
øø 
	IsDeleted
¿¿ 
=
¿¿ 
false
¿¿ 
,
¿¿ 
CreatedByUserId
¡¡ 
=
¡¡ 
adminUserId
¡¡ )
,
¡¡) *
AssignedToUserId
¬¬ 
=
¬¬ 
request
¬¬ &
.
¬¬& '
AssignedToUserId
¬¬' 7
}
√√ 	
;
√√	 

var
≈≈ 
createdTask
≈≈ 
=
≈≈ 
await
≈≈ 
_taskRepository
≈≈  /
.
≈≈/ 0
AddAsync
≈≈0 8
(
≈≈8 9
task
≈≈9 =
)
≈≈= >
;
≈≈> ?
return
∆∆ 
await
∆∆ "
GetTaskResponseAsync
∆∆ )
(
∆∆) *
createdTask
∆∆* 5
.
∆∆5 6
Id
∆∆6 8
)
∆∆8 9
;
∆∆9 :
}
«« 
public
…… 

async
…… 
Task
…… 
<
…… 
TaskResponse
…… "
>
……" #"
UpdateAdminTaskAsync
……$ 8
(
……8 9
int
   
id
   
,
   
UpdateTaskRequest
ÀÀ 
request
ÀÀ !
,
ÀÀ! "
int
ÃÃ 
adminUserId
ÃÃ 
,
ÃÃ 
string
ÕÕ 
currentUserRole
ÕÕ 
)
ÕÕ 
{
ŒŒ 
EnsureAdmin
œœ 
(
œœ 
adminUserId
œœ 
,
œœ  
currentUserRole
œœ! 0
)
œœ0 1
;
œœ1 2
var
—— 
validationResult
—— 
=
—— 
await
—— $
_updateValidator
——% 5
.
——5 6
ValidateAsync
——6 C
(
——C D
request
——D K
)
——K L
;
——L M
if
““ 

(
““ 
!
““ 
validationResult
““ 
.
““ 
IsValid
““ %
)
““% &
throw
”” 
new
”” $
AppValidationException
”” ,
(
””, -
validationResult
””- =
.
””= >
ToDictionary
””> J
(
””J K
)
””K L
)
””L M
;
””M N
var
’’ 
task
’’ 
=
’’ 
await
’’ !
GetTaskOrThrowAsync
’’ ,
(
’’, -
id
’’- /
)
’’/ 0
;
’’0 1
if
◊◊ 

(
◊◊ 
!
◊◊ 
request
◊◊ 
.
◊◊ 
AssignedToUserId
◊◊ %
.
◊◊% &
HasValue
◊◊& .
)
◊◊. /
{
ÿÿ 	
throw
ŸŸ 
new
ŸŸ $
AppValidationException
ŸŸ ,
(
ŸŸ, -
new
⁄⁄ 

Dictionary
⁄⁄ 
<
⁄⁄ 
string
⁄⁄ %
,
⁄⁄% &
string
⁄⁄' -
[
⁄⁄- .
]
⁄⁄. /
>
⁄⁄/ 0
{
€€ 
[
‹‹ 
$str
‹‹ '
]
‹‹' (
=
‹‹) *
new
‹‹+ .
[
‹‹. /
]
‹‹/ 0
{
‹‹1 2
$str
‹‹3 d
}
‹‹e f
}
›› 
)
›› 
;
›› 
}
ﬁﬁ 	
await
‡‡ '
ValidateAssignedUserAsync
‡‡ '
(
‡‡' (
request
‡‡( /
.
‡‡/ 0
AssignedToUserId
‡‡0 @
)
‡‡@ A
;
‡‡A B
task
‚‚ 
.
‚‚ 
Title
‚‚ 
=
‚‚ 
request
‚‚ 
.
‚‚ 
Title
‚‚ "
.
‚‚" #
Trim
‚‚# '
(
‚‚' (
)
‚‚( )
;
‚‚) *
task
„„ 
.
„„ 
Description
„„ 
=
„„ 
request
„„ "
.
„„" #
Description
„„# .
?
„„. /
.
„„/ 0
Trim
„„0 4
(
„„4 5
)
„„5 6
;
„„6 7
task
‰‰ 
.
‰‰ 
Category
‰‰ 
=
‰‰ 
request
‰‰ 
.
‰‰  
Category
‰‰  (
.
‰‰( )
Trim
‰‰) -
(
‰‰- .
)
‰‰. /
;
‰‰/ 0
task
ÂÂ 
.
ÂÂ 
Priority
ÂÂ 
=
ÂÂ 
(
ÂÂ 
TaskPriority
ÂÂ %
)
ÂÂ% &
request
ÂÂ& -
.
ÂÂ- .
Priority
ÂÂ. 6
;
ÂÂ6 7
task
ÊÊ 
.
ÊÊ 
DueDate
ÊÊ 
=
ÊÊ 
request
ÊÊ 
.
ÊÊ 
DueDate
ÊÊ &
;
ÊÊ& '
task
ÁÁ 
.
ÁÁ 
AssignedToUserId
ÁÁ 
=
ÁÁ 
request
ÁÁ  '
.
ÁÁ' (
AssignedToUserId
ÁÁ( 8
;
ÁÁ8 9
task
ËË 
.
ËË 
	UpdatedAt
ËË 
=
ËË 
DateTime
ËË !
.
ËË! "
UtcNow
ËË" (
;
ËË( )
await
ÍÍ 
_taskRepository
ÍÍ 
.
ÍÍ 
UpdateAsync
ÍÍ )
(
ÍÍ) *
task
ÍÍ* .
)
ÍÍ. /
;
ÍÍ/ 0
return
ÎÎ 
await
ÎÎ "
GetTaskResponseAsync
ÎÎ )
(
ÎÎ) *
id
ÎÎ* ,
)
ÎÎ, -
;
ÎÎ- .
}
ÏÏ 
public
ÓÓ 

async
ÓÓ 
Task
ÓÓ 
<
ÓÓ 
TaskResponse
ÓÓ "
>
ÓÓ" #(
ChangeAdminTaskStatusAsync
ÓÓ$ >
(
ÓÓ> ?
int
ÔÔ 
id
ÔÔ 
,
ÔÔ %
UpdateTaskStatusRequest
 
request
  '
,
' (
int
ÒÒ 
adminUserId
ÒÒ 
,
ÒÒ 
string
ÚÚ 
currentUserRole
ÚÚ 
)
ÚÚ 
{
ÛÛ 
EnsureAdmin
ÙÙ 
(
ÙÙ 
adminUserId
ÙÙ 
,
ÙÙ  
currentUserRole
ÙÙ! 0
)
ÙÙ0 1
;
ÙÙ1 2
var
ˆˆ 
validationResult
ˆˆ 
=
ˆˆ 
await
ˆˆ $
_statusValidator
ˆˆ% 5
.
ˆˆ5 6
ValidateAsync
ˆˆ6 C
(
ˆˆC D
request
ˆˆD K
)
ˆˆK L
;
ˆˆL M
if
˜˜ 

(
˜˜ 
!
˜˜ 
validationResult
˜˜ 
.
˜˜ 
IsValid
˜˜ %
)
˜˜% &
throw
¯¯ 
new
¯¯ $
AppValidationException
¯¯ ,
(
¯¯, -
validationResult
¯¯- =
.
¯¯= >
ToDictionary
¯¯> J
(
¯¯J K
)
¯¯K L
)
¯¯L M
;
¯¯M N
var
˙˙ 
task
˙˙ 
=
˙˙ 
await
˙˙ !
GetTaskOrThrowAsync
˙˙ ,
(
˙˙, -
id
˙˙- /
)
˙˙/ 0
;
˙˙0 1
task
¸¸ 
.
¸¸ 
Status
¸¸ 
=
¸¸ 
(
¸¸ 
EntityTaskStatus
¸¸ '
)
¸¸' (
request
¸¸( /
.
¸¸/ 0
Status
¸¸0 6
;
¸¸6 7
task
˝˝ 
.
˝˝ 
	UpdatedAt
˝˝ 
=
˝˝ 
DateTime
˝˝ !
.
˝˝! "
UtcNow
˝˝" (
;
˝˝( )
await
ˇˇ 
_taskRepository
ˇˇ 
.
ˇˇ 
UpdateAsync
ˇˇ )
(
ˇˇ) *
task
ˇˇ* .
)
ˇˇ. /
;
ˇˇ/ 0
return
ÄÄ 
await
ÄÄ "
GetTaskResponseAsync
ÄÄ )
(
ÄÄ) *
id
ÄÄ* ,
)
ÄÄ, -
;
ÄÄ- .
}
ÅÅ 
public
ÉÉ 

async
ÉÉ 
Task
ÉÉ 
<
ÉÉ 
TaskResponse
ÉÉ "
>
ÉÉ" #)
ChangeAdminTaskDueDateAsync
ÉÉ$ ?
(
ÉÉ? @
int
ÑÑ 
id
ÑÑ 
,
ÑÑ &
UpdateTaskDueDateRequest
ÖÖ  
request
ÖÖ! (
,
ÖÖ( )
int
ÜÜ 
adminUserId
ÜÜ 
,
ÜÜ 
string
áá 
currentUserRole
áá 
)
áá 
{
àà 
EnsureAdmin
ââ 
(
ââ 
adminUserId
ââ 
,
ââ  
currentUserRole
ââ! 0
)
ââ0 1
;
ââ1 2
var
ãã 
task
ãã 
=
ãã 
await
ãã !
GetTaskOrThrowAsync
ãã ,
(
ãã, -
id
ãã- /
)
ãã/ 0
;
ãã0 1
task
çç 
.
çç 
DueDate
çç 
=
çç 
request
çç 
.
çç 
DueDate
çç &
;
çç& '
task
éé 
.
éé 
	UpdatedAt
éé 
=
éé 
DateTime
éé !
.
éé! "
UtcNow
éé" (
;
éé( )
await
êê 
_taskRepository
êê 
.
êê 
UpdateAsync
êê )
(
êê) *
task
êê* .
)
êê. /
;
êê/ 0
return
ëë 
await
ëë "
GetTaskResponseAsync
ëë )
(
ëë) *
id
ëë* ,
)
ëë, -
;
ëë- .
}
íí 
public
îî 

async
îî 
Task
îî 
<
îî 
TaskResponse
îî "
>
îî" #*
ChangeAdminTaskPriorityAsync
îî$ @
(
îî@ A
int
ïï 
id
ïï 
,
ïï '
UpdateTaskPriorityRequest
ññ !
request
ññ" )
,
ññ) *
int
óó 
adminUserId
óó 
,
óó 
string
òò 
currentUserRole
òò 
)
òò 
{
ôô 
EnsureAdmin
öö 
(
öö 
adminUserId
öö 
,
öö  
currentUserRole
öö! 0
)
öö0 1
;
öö1 2
if
úú 

(
úú 
!
úú 
Enum
úú 
.
úú 
	IsDefined
úú 
(
úú 
typeof
úú "
(
úú" #
TaskPriority
úú# /
)
úú/ 0
,
úú0 1
request
úú2 9
.
úú9 :
Priority
úú: B
)
úúB C
)
úúC D
{
ùù 	
throw
ûû 
new
ûû $
AppValidationException
ûû ,
(
ûû, -
new
üü 

Dictionary
üü 
<
üü 
string
üü %
,
üü% &
string
üü' -
[
üü- .
]
üü. /
>
üü/ 0
{
†† 
[
°° 
$str
°° 
]
°°  
=
°°! "
new
°°# &
[
°°& '
]
°°' (
{
°°) *
$str
°°+ C
}
°°D E
}
¢¢ 
)
¢¢ 
;
¢¢ 
}
££ 	
var
•• 
task
•• 
=
•• 
await
•• !
GetTaskOrThrowAsync
•• ,
(
••, -
id
••- /
)
••/ 0
;
••0 1
task
ßß 
.
ßß 
Priority
ßß 
=
ßß 
(
ßß 
TaskPriority
ßß %
)
ßß% &
request
ßß& -
.
ßß- .
Priority
ßß. 6
;
ßß6 7
task
®® 
.
®® 
	UpdatedAt
®® 
=
®® 
DateTime
®® !
.
®®! "
UtcNow
®®" (
;
®®( )
await
™™ 
_taskRepository
™™ 
.
™™ 
UpdateAsync
™™ )
(
™™) *
task
™™* .
)
™™. /
;
™™/ 0
return
´´ 
await
´´ "
GetTaskResponseAsync
´´ )
(
´´) *
id
´´* ,
)
´´, -
;
´´- .
}
¨¨ 
public
ÆÆ 

async
ÆÆ 
Task
ÆÆ "
DeleteAdminTaskAsync
ÆÆ *
(
ÆÆ* +
int
ØØ 
id
ØØ 
,
ØØ 
int
∞∞ 
adminUserId
∞∞ 
,
∞∞ 
string
±± 
currentUserRole
±± 
)
±± 
{
≤≤ 
EnsureAdmin
≥≥ 
(
≥≥ 
adminUserId
≥≥ 
,
≥≥  
currentUserRole
≥≥! 0
)
≥≥0 1
;
≥≥1 2
var
µµ 
task
µµ 
=
µµ 
await
µµ !
GetTaskOrThrowAsync
µµ ,
(
µµ, -
id
µµ- /
)
µµ/ 0
;
µµ0 1
await
∂∂ 
_taskRepository
∂∂ 
.
∂∂ 
DeleteAsync
∂∂ )
(
∂∂) *
task
∂∂* .
)
∂∂. /
;
∂∂/ 0
}
∑∑ 
private
ΩΩ 
async
ΩΩ 
Task
ΩΩ (
ValidateCreateRequestAsync
ΩΩ 1
(
ΩΩ1 2
CreateTaskRequest
ΩΩ2 C
request
ΩΩD K
)
ΩΩK L
{
ææ 
var
øø 
result
øø 
=
øø 
await
øø 
_createValidator
øø +
.
øø+ ,
ValidateAsync
øø, 9
(
øø9 :
request
øø: A
)
øøA B
;
øøB C
if
¿¿ 

(
¿¿ 
!
¿¿ 
result
¿¿ 
.
¿¿ 
IsValid
¿¿ 
)
¿¿ 
throw
¡¡ 
new
¡¡ $
AppValidationException
¡¡ ,
(
¡¡, -
result
¡¡- 3
.
¡¡3 4
ToDictionary
¡¡4 @
(
¡¡@ A
)
¡¡A B
)
¡¡B C
;
¡¡C D
}
¬¬ 
private
ƒƒ 
async
ƒƒ 
Task
ƒƒ (
ValidateUpdateRequestAsync
ƒƒ 1
(
ƒƒ1 2
UpdateTaskRequest
ƒƒ2 C
request
ƒƒD K
)
ƒƒK L
{
≈≈ 
var
∆∆ 
result
∆∆ 
=
∆∆ 
await
∆∆ 
_updateValidator
∆∆ +
.
∆∆+ ,
ValidateAsync
∆∆, 9
(
∆∆9 :
request
∆∆: A
)
∆∆A B
;
∆∆B C
if
«« 

(
«« 
!
«« 
result
«« 
.
«« 
IsValid
«« 
)
«« 
throw
»» 
new
»» $
AppValidationException
»» ,
(
»», -
result
»»- 3
.
»»3 4
ToDictionary
»»4 @
(
»»@ A
)
»»A B
)
»»B C
;
»»C D
}
…… 
private
ÀÀ 
async
ÀÀ 
Task
ÀÀ (
ValidateStatusRequestAsync
ÀÀ 1
(
ÀÀ1 2%
UpdateTaskStatusRequest
ÀÀ2 I
request
ÀÀJ Q
)
ÀÀQ R
{
ÃÃ 
var
ÕÕ 
result
ÕÕ 
=
ÕÕ 
await
ÕÕ 
_statusValidator
ÕÕ +
.
ÕÕ+ ,
ValidateAsync
ÕÕ, 9
(
ÕÕ9 :
request
ÕÕ: A
)
ÕÕA B
;
ÕÕB C
if
ŒŒ 

(
ŒŒ 
!
ŒŒ 
result
ŒŒ 
.
ŒŒ 
IsValid
ŒŒ 
)
ŒŒ 
throw
œœ 
new
œœ $
AppValidationException
œœ ,
(
œœ, -
result
œœ- 3
.
œœ3 4
ToDictionary
œœ4 @
(
œœ@ A
)
œœA B
)
œœB C
;
œœC D
}
–– 
private
““ 
async
““ 
Task
““ '
ValidateAssignedUserAsync
““ 0
(
““0 1
int
““1 4
?
““4 5
userId
““6 <
)
““< =
{
”” 
if
‘‘ 

(
‘‘ 
!
‘‘ 
userId
‘‘ 
.
‘‘ 
HasValue
‘‘ 
)
‘‘ 
return
‘‘ $
;
‘‘$ %
var
÷÷ 
user
÷÷ 
=
÷÷ 
await
÷÷ 
_userRepository
÷÷ (
.
÷÷( )
GetByIdAsync
÷÷) 5
(
÷÷5 6
userId
÷÷6 <
.
÷÷< =
Value
÷÷= B
)
÷÷B C
;
÷÷C D
if
◊◊ 

(
◊◊ 
user
◊◊ 
==
◊◊ 
null
◊◊ 
)
◊◊ 
throw
ÿÿ 
new
ÿÿ 
NotFoundException
ÿÿ '
(
ÿÿ' (
$"
ÿÿ( *
$str
ÿÿ* 7
{
ÿÿ7 8
userId
ÿÿ8 >
.
ÿÿ> ?
Value
ÿÿ? D
}
ÿÿD E
$str
ÿÿE T
"
ÿÿT U
)
ÿÿU V
;
ÿÿV W
}
ŸŸ 
private
ﬂﬂ 
static
ﬂﬂ 
bool
ﬂﬂ 
IsAdmin
ﬂﬂ 
(
ﬂﬂ  
string
ﬂﬂ  &
role
ﬂﬂ' +
)
ﬂﬂ+ ,
=>
ﬂﬂ- /
string
‡‡ 
.
‡‡ 
Equals
‡‡ 
(
‡‡ 
role
‡‡ 
,
‡‡ 
	AdminRole
‡‡ %
,
‡‡% &
StringComparison
‡‡' 7
.
‡‡7 8
OrdinalIgnoreCase
‡‡8 I
)
‡‡I J
;
‡‡J K
private
‚‚ 
void
‚‚ 
EnsureAdmin
‚‚ 
(
‚‚ 
int
‚‚  
userId
‚‚! '
,
‚‚' (
string
‚‚) /
role
‚‚0 4
)
‚‚4 5
{
„„ 
if
‰‰ 

(
‰‰ 
!
‰‰ 
IsAdmin
‰‰ 
(
‰‰ 
role
‰‰ 
)
‰‰ 
)
‰‰ 
throw
ÂÂ 
new
ÂÂ $
AuthorizationException
ÂÂ ,
(
ÂÂ, -
$str
ÂÂ- S
)
ÂÂS T
;
ÂÂT U
}
ÊÊ 
private
ËË 
static
ËË 
void
ËË 
EnsureCanView
ËË %
(
ËË% &
TaskItem
ËË& .
task
ËË/ 3
,
ËË3 4
int
ËË5 8
currentUserId
ËË9 F
,
ËËF G
string
ËËH N
currentUserRole
ËËO ^
)
ËË^ _
{
ÈÈ 
if
ÍÍ 

(
ÍÍ 
IsAdmin
ÍÍ 
(
ÍÍ 
currentUserRole
ÍÍ #
)
ÍÍ# $
)
ÍÍ$ %
return
ÍÍ& ,
;
ÍÍ, -
if
ÏÏ 

(
ÏÏ 
task
ÏÏ 
.
ÏÏ 
CreatedByUserId
ÏÏ  
!=
ÏÏ! #
currentUserId
ÏÏ$ 1
&&
ÏÏ2 4
task
ÏÏ5 9
.
ÏÏ9 :
AssignedToUserId
ÏÏ: J
!=
ÏÏK M
currentUserId
ÏÏN [
)
ÏÏ[ \
throw
ÌÌ 
new
ÌÌ $
AuthorizationException
ÌÌ ,
(
ÌÌ, -
$str
ÌÌ- \
)
ÌÌ\ ]
;
ÌÌ] ^
}
ÓÓ 
private
 
static
 
void
 
EnsureCanModify
 '
(
' (
TaskItem
( 0
task
1 5
,
5 6
int
7 :
currentUserId
; H
,
H I
string
J P
currentUserRole
Q `
)
` a
{
ÒÒ 
if
ÚÚ 

(
ÚÚ 
IsAdmin
ÚÚ 
(
ÚÚ 
currentUserRole
ÚÚ #
)
ÚÚ# $
)
ÚÚ$ %
return
ÚÚ& ,
;
ÚÚ, -
if
ıı 

(
ıı 
task
ıı 
.
ıı 
CreatedByUserId
ıı  
!=
ıı! #
currentUserId
ıı$ 1
)
ıı1 2
throw
ˆˆ 
new
ˆˆ $
AuthorizationException
ˆˆ ,
(
ˆˆ, -
$str
ˆˆ- ^
)
ˆˆ^ _
;
ˆˆ_ `
}
˜˜ 
private
˘˘ 
static
˘˘ 
void
˘˘ #
EnsureCanChangeStatus
˘˘ -
(
˘˘- .
TaskItem
˘˘. 6
task
˘˘7 ;
,
˘˘; <
int
˘˘= @
currentUserId
˘˘A N
,
˘˘N O
string
˘˘P V
currentUserRole
˘˘W f
)
˘˘f g
{
˙˙ 
if
˚˚ 

(
˚˚ 
IsAdmin
˚˚ 
(
˚˚ 
currentUserRole
˚˚ #
)
˚˚# $
)
˚˚$ %
return
˚˚& ,
;
˚˚, -
if
˛˛ 

(
˛˛ 
task
˛˛ 
.
˛˛ 
CreatedByUserId
˛˛  
!=
˛˛! #
currentUserId
˛˛$ 1
&&
˛˛2 4
task
˛˛5 9
.
˛˛9 :
AssignedToUserId
˛˛: J
!=
˛˛K M
currentUserId
˛˛N [
)
˛˛[ \
throw
ˇˇ 
new
ˇˇ $
AuthorizationException
ˇˇ ,
(
ˇˇ, -
$str
ˇˇ- l
)
ˇˇl m
;
ˇˇm n
}
ÄÄ 
private
ÜÜ 
async
ÜÜ 
Task
ÜÜ 
<
ÜÜ 
TaskItem
ÜÜ 
>
ÜÜ  !
GetTaskOrThrowAsync
ÜÜ! 4
(
ÜÜ4 5
int
ÜÜ5 8
id
ÜÜ9 ;
)
ÜÜ; <
{
áá 
var
àà 
task
àà 
=
àà 
await
àà 
_taskRepository
àà (
.
àà( )
GetByIdAsync
àà) 5
(
àà5 6
id
àà6 8
)
àà8 9
;
àà9 :
if
ââ 

(
ââ 
task
ââ 
==
ââ 
null
ââ 
)
ââ 
throw
ää 
new
ää 
NotFoundException
ää '
(
ää' (
$"
ää( *
$str
ää* 7
{
ää7 8
id
ää8 :
}
ää: ;
$str
ää; J
"
ääJ K
)
ääK L
;
ääL M
return
ãã 
task
ãã 
;
ãã 
}
åå 
private
éé 
async
éé 
Task
éé 
<
éé 
TaskResponse
éé #
>
éé# $"
GetTaskResponseAsync
éé% 9
(
éé9 :
int
éé: =
id
éé> @
)
éé@ A
{
èè 
var
êê 
task
êê 
=
êê 
await
êê !
GetTaskOrThrowAsync
êê ,
(
êê, -
id
êê- /
)
êê/ 0
;
êê0 1
return
ëë 
MapToResponse
ëë 
(
ëë 
task
ëë !
)
ëë! "
;
ëë" #
}
íí 
private
îî 
async
îî 
Task
îî 
<
îî 
IReadOnlyList
îî $
<
îî$ %
TaskItem
îî% -
>
îî- .
>
îî. /"
GetVisibleTasksAsync
îî0 D
(
îîD E
int
îîE H
userId
îîI O
,
îîO P
string
îîQ W
role
îîX \
)
îî\ ]
{
ïï 
if
ññ 

(
ññ 
IsAdmin
ññ 
(
ññ 
role
ññ 
)
ññ 
)
ññ 
return
óó 
await
óó 
_taskRepository
óó (
.
óó( )
GetAllAsync
óó) 4
(
óó4 5
)
óó5 6
;
óó6 7
var
õõ 
created
õõ 
=
õõ 
await
õõ 
_taskRepository
õõ ,
.
õõ, -!
GetByCreatorIdAsync
õõ- @
(
õõ@ A
userId
õõA G
)
õõG H
;
õõH I
var
úú 
assigned
úú 
=
úú 
await
úú 
_taskRepository
úú ,
.
úú, -&
GetByAssignedUserIdAsync
úú- E
(
úúE F
userId
úúF L
)
úúL M
;
úúM N
return
ûû 
created
ûû 
.
üü 
Union
üü 
(
üü 
assigned
üü 
,
üü  
TaskItemIdComparer
üü /
.
üü/ 0
Instance
üü0 8
)
üü8 9
.
†† 
ToList
†† 
(
†† 
)
†† 
;
†† 
}
°° 
private
££ 
async
££ 
Task
££ 
<
££ 
IReadOnlyList
££ $
<
££$ %
TaskResponse
££% 1
>
££1 2
>
££2 3#
GetTasksByStatusAsync
££4 I
(
££I J
int
§§ 
currentUserId
§§ 
,
§§ 
string
•• 
currentUserRole
•• 
,
•• 
EntityTaskStatus
¶¶ 
status
¶¶ 
)
¶¶  
{
ßß 
var
®® 
tasks
®® 
=
®® 
await
®® "
GetVisibleTasksAsync
®® .
(
®®. /
currentUserId
®®/ <
,
®®< =
currentUserRole
®®> M
)
®®M N
;
®®N O
return
©© 
tasks
©© 
.
™™ 
Where
™™ 
(
™™ 
t
™™ 
=>
™™ 
t
™™ 
.
™™ 
Status
™™  
==
™™! #
status
™™$ *
)
™™* +
.
´´ 
Select
´´ 
(
´´ 
MapToResponse
´´ !
)
´´! "
.
¨¨ 
ToList
¨¨ 
(
¨¨ 
)
¨¨ 
;
¨¨ 
}
≠≠ 
private
≥≥ 
static
≥≥ 
int
≥≥ %
DetermineAssignedUserId
≥≥ .
(
≥≥. /
CreateTaskRequest
¥¥ 
request
¥¥ !
,
¥¥! "
int
µµ 
currentUserId
µµ 
,
µµ 
bool
∂∂ 
isAdmin
∂∂ 
)
∂∂ 
{
∑∑ 
if
∏∏ 

(
∏∏ 
isAdmin
∏∏ 
)
∏∏ 
{
ππ 	
if
∫∫ 
(
∫∫ 
!
∫∫ 
request
∫∫ 
.
∫∫ 
AssignedToUserId
∫∫ )
.
∫∫) *
HasValue
∫∫* 2
)
∫∫2 3
throw
ªª 
new
ªª $
AppValidationException
ªª 0
(
ªª0 1
new
ºº 

Dictionary
ºº "
<
ºº" #
string
ºº# )
,
ºº) *
string
ºº+ 1
[
ºº1 2
]
ºº2 3
>
ºº3 4
{
ΩΩ 
[
ææ 
$str
ææ +
]
ææ+ ,
=
ææ- .
new
ææ/ 2
[
ææ2 3
]
ææ3 4
{
ææ5 6
$str
ææ7 n
}
ææo p
}
øø 
)
øø 
;
øø 
return
¡¡ 
request
¡¡ 
.
¡¡ 
AssignedToUserId
¡¡ +
.
¡¡+ ,
Value
¡¡, 1
;
¡¡1 2
}
¬¬ 	
return
≈≈ 
currentUserId
≈≈ 
;
≈≈ 
}
∆∆ 
private
»» 
static
»» 
TaskItem
»» 
CreateTaskEntity
»» ,
(
»», -
CreateTaskRequest
…… 
request
…… !
,
……! "
int
   
createdByUserId
   
,
   
int
ÀÀ 
assignedToUserId
ÀÀ 
)
ÀÀ 
{
ÃÃ 
return
ÕÕ 
new
ÕÕ 
TaskItem
ÕÕ 
{
ŒŒ 	
Title
œœ 
=
œœ 
request
œœ 
.
œœ 
Title
œœ !
.
œœ! "
Trim
œœ" &
(
œœ& '
)
œœ' (
,
œœ( )
Description
–– 
=
–– 
request
–– !
.
––! "
Description
––" -
?
––- .
.
––. /
Trim
––/ 3
(
––3 4
)
––4 5
,
––5 6
Category
—— 
=
—— 
request
—— 
.
—— 
Category
—— '
.
——' (
Trim
——( ,
(
——, -
)
——- .
,
——. /
Priority
““ 
=
““ 
(
““ 
TaskPriority
““ $
)
““$ %
request
““% ,
.
““, -
Priority
““- 5
,
““5 6
Status
”” 
=
”” 
EntityTaskStatus
”” %
.
””% &
Pending
””& -
,
””- .
DueDate
‘‘ 
=
‘‘ 
request
‘‘ 
.
‘‘ 
DueDate
‘‘ %
,
‘‘% &
	CreatedAt
’’ 
=
’’ 
DateTime
’’  
.
’’  !
UtcNow
’’! '
,
’’' (
	UpdatedAt
÷÷ 
=
÷÷ 
null
÷÷ 
,
÷÷ 
	IsDeleted
◊◊ 
=
◊◊ 
false
◊◊ 
,
◊◊ 
CreatedByUserId
ÿÿ 
=
ÿÿ 
createdByUserId
ÿÿ -
,
ÿÿ- .
AssignedToUserId
ŸŸ 
=
ŸŸ 
assignedToUserId
ŸŸ /
}
⁄⁄ 	
;
⁄⁄	 

}
€€ 
private
›› 
static
›› 
void
›› 
UpdateTaskEntity
›› (
(
››( )
TaskItem
››) 1
task
››2 6
,
››6 7
UpdateTaskRequest
››8 I
request
››J Q
)
››Q R
{
ﬁﬁ 
task
ﬂﬂ 
.
ﬂﬂ 
Title
ﬂﬂ 
=
ﬂﬂ 
request
ﬂﬂ 
.
ﬂﬂ 
Title
ﬂﬂ "
.
ﬂﬂ" #
Trim
ﬂﬂ# '
(
ﬂﬂ' (
)
ﬂﬂ( )
;
ﬂﬂ) *
task
‡‡ 
.
‡‡ 
Description
‡‡ 
=
‡‡ 
request
‡‡ "
.
‡‡" #
Description
‡‡# .
?
‡‡. /
.
‡‡/ 0
Trim
‡‡0 4
(
‡‡4 5
)
‡‡5 6
;
‡‡6 7
task
·· 
.
·· 
Category
·· 
=
·· 
request
·· 
.
··  
Category
··  (
.
··( )
Trim
··) -
(
··- .
)
··. /
;
··/ 0
task
‚‚ 
.
‚‚ 
Priority
‚‚ 
=
‚‚ 
(
‚‚ 
TaskPriority
‚‚ %
)
‚‚% &
request
‚‚& -
.
‚‚- .
Priority
‚‚. 6
;
‚‚6 7
task
„„ 
.
„„ 
DueDate
„„ 
=
„„ 
request
„„ 
.
„„ 
DueDate
„„ &
;
„„& '
}
‰‰ 
private
ÊÊ 
static
ÊÊ 
EntityTaskStatus
ÊÊ #
MapToTaskStatus
ÊÊ$ 3
(
ÊÊ3 4
int
ÊÊ4 7
status
ÊÊ8 >
)
ÊÊ> ?
=>
ÊÊ@ B
(
ÁÁ 	
EntityTaskStatus
ÁÁ	 
)
ÁÁ 
status
ÁÁ  
;
ÁÁ  !
private
ÍÍ 
sealed
ÍÍ 
class
ÍÍ  
TaskItemIdComparer
ÍÍ +
:
ÍÍ, -
IEqualityComparer
ÍÍ. ?
<
ÍÍ? @
TaskItem
ÍÍ@ H
>
ÍÍH I
{
ÎÎ 
public
ÏÏ 
static
ÏÏ 
readonly
ÏÏ  
TaskItemIdComparer
ÏÏ 1
Instance
ÏÏ2 :
=
ÏÏ; <
new
ÏÏ= @
(
ÏÏ@ A
)
ÏÏA B
;
ÏÏB C
public
ÌÌ 
bool
ÌÌ 
Equals
ÌÌ 
(
ÌÌ 
TaskItem
ÌÌ #
?
ÌÌ# $
x
ÌÌ% &
,
ÌÌ& '
TaskItem
ÌÌ( 0
?
ÌÌ0 1
y
ÌÌ2 3
)
ÌÌ3 4
=>
ÌÌ5 7
x
ÌÌ8 9
?
ÌÌ9 :
.
ÌÌ: ;
Id
ÌÌ; =
==
ÌÌ> @
y
ÌÌA B
?
ÌÌB C
.
ÌÌC D
Id
ÌÌD F
;
ÌÌF G
public
ÓÓ 
int
ÓÓ 
GetHashCode
ÓÓ 
(
ÓÓ 
TaskItem
ÓÓ '
obj
ÓÓ( +
)
ÓÓ+ ,
=>
ÓÓ- /
obj
ÓÓ0 3
.
ÓÓ3 4
Id
ÓÓ4 6
.
ÓÓ6 7
GetHashCode
ÓÓ7 B
(
ÓÓB C
)
ÓÓC D
;
ÓÓD E
}
ÔÔ 
private
ÒÒ 

static
ÒÒ 
TaskResponse
ÒÒ 
MapToResponse
ÒÒ ,
(
ÒÒ, -
TaskItem
ÒÒ- 5
task
ÒÒ6 :
)
ÒÒ: ;
=>
ÒÒ< >
new
ÚÚ 
TaskResponse
ÚÚ 
{
ÛÛ 
Id
ÙÙ 

=
ÙÙ 
task
ÙÙ 
.
ÙÙ 
Id
ÙÙ 
,
ÙÙ 
Title
ıı 
=
ıı 
task
ıı 
.
ıı 
Title
ıı 
,
ıı 
Description
ˆˆ 
=
ˆˆ 
task
ˆˆ 
.
ˆˆ 
Description
ˆˆ &
,
ˆˆ& '
Category
˜˜ 
=
˜˜ 
task
˜˜ 
.
˜˜ 
Category
˜˜  
,
˜˜  !
Priority
¯¯ 
=
¯¯ 
task
¯¯ 
.
¯¯ 
Priority
¯¯  
.
¯¯  !
ToString
¯¯! )
(
¯¯) *
)
¯¯* +
,
¯¯+ ,
Status
˘˘ 
=
˘˘ 
task
˘˘ 
.
˘˘ 
Status
˘˘ 
.
˘˘ 
ToString
˘˘ %
(
˘˘% &
)
˘˘& '
,
˘˘' (
DueDate
˙˙ 
=
˙˙ 
task
˙˙ 
.
˙˙ 
DueDate
˙˙ 
,
˙˙ 
	CreatedAt
˚˚ 
=
˚˚ 
task
˚˚ 
.
˚˚ 
	CreatedAt
˚˚ "
,
˚˚" #
	UpdatedAt
¸¸ 
=
¸¸ 
task
¸¸ 
.
¸¸ 
	UpdatedAt
¸¸ "
,
¸¸" #
CreatedByUserId
˝˝ 
=
˝˝ 
task
˝˝ 
.
˝˝ 
CreatedByUserId
˝˝ .
,
˝˝. /
CreatedByName
˛˛ 
=
˛˛ 
$"
˛˛ 
{
˛˛ 
task
˛˛ 
.
˛˛  
CreatedByUser
˛˛  -
.
˛˛- .
	FirstName
˛˛. 7
}
˛˛7 8
$str
˛˛8 9
{
˛˛9 :
task
˛˛: >
.
˛˛> ?
CreatedByUser
˛˛? L
.
˛˛L M
LastName
˛˛M U
}
˛˛U V
"
˛˛V W
.
˛˛W X
Trim
˛˛X \
(
˛˛\ ]
)
˛˛] ^
,
˛˛^ _
AssignedToUserId
ˇˇ 
=
ˇˇ 
task
ˇˇ 
.
ˇˇ  
AssignedToUserId
ˇˇ  0
,
ˇˇ0 1
AssignedToName
ÄÄ 
=
ÄÄ 
task
ÄÄ 
.
ÄÄ 
AssignedToUser
ÄÄ ,
!=
ÄÄ- /
null
ÄÄ0 4
?
ÅÅ 
$"
ÅÅ 
{
ÅÅ 
task
ÅÅ 
.
ÅÅ 
AssignedToUser
ÅÅ $
.
ÅÅ$ %
	FirstName
ÅÅ% .
}
ÅÅ. /
$str
ÅÅ/ 0
{
ÅÅ0 1
task
ÅÅ1 5
.
ÅÅ5 6
AssignedToUser
ÅÅ6 D
.
ÅÅD E
LastName
ÅÅE M
}
ÅÅM N
"
ÅÅN O
.
ÅÅO P
Trim
ÅÅP T
(
ÅÅT U
)
ÅÅU V
:
ÇÇ 
null
ÇÇ 
}
ÉÉ 
;
ÉÉ 
}ÑÑ ﬁl
zC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Services\AuthService.cs
	namespace		 	
Taskify		
 
.		 
Business		 
.		 
Services		 #
;		# $
public 
class 
AuthService 
: 
IAuthService '
{ 
private 
readonly 
IUserRepository $
_userRepository% 4
;4 5
private 
readonly "
IUserSessionRepository +
_sessionRepository, >
;> ?
private 
readonly 
IPasswordHasher $
<$ %
User% )
>) *
_passwordHasher+ :
;: ;
private 
readonly 
IJwtTokenGenerator '
_jwtTokenGenerator( :
;: ;
private 
readonly 

IValidator 
<  
RegisterRequest  /
>/ 0
_registerValidator1 C
;C D
private 
readonly 

IValidator 
<  
LoginRequest  ,
>, -
_loginValidator. =
;= >
public 
AuthService 
( 
IUserRepository 
userRepository "
," #"
IUserSessionRepository 
sessionRepository ,
,, -
IPasswordHasher 
< 
User 
> 
passwordHasher (
,( )
IJwtTokenGenerator 
jwtTokenGenerator (
,( )

IValidator 
< 
RegisterRequest 
> 
registerValidator  1
,1 2

IValidator 
< 
LoginRequest 
> 
loginValidator +
)+ ,
{ 
_userRepository 
= 
userRepository $
;$ %
_sessionRepository 
= 
sessionRepository *
;* +
_passwordHasher 
= 
passwordHasher $
;$ %
_jwtTokenGenerator 
= 
jwtTokenGenerator *
;* +
_registerValidator   
=   
registerValidator   *
;  * +
_loginValidator!! 
=!! 
loginValidator!! $
;!!$ %
}"" 
public## 

async## 
Task## 
<## 
AuthResponse## "
>##" #
RegisterAsync##$ 1
(##1 2
RegisterRequest$$ 
request$$ 
)$$  
{%% 
var&& 
validationResult&& 
=&& 
await'' 	
_registerValidator''
 
.'' 
ValidateAsync'' *
(''* +
request''+ 2
)''2 3
;''3 4
if)) 

()) 
!)) 
validationResult)) 
.)) 
IsValid)) %
)))% &
{** 	
throw++ 
new++ 
Taskify++ 
.++  
Business++  (
.++( )

Exceptions++) 3
.++3 4
ValidationException++4 G
(++G H
validationResult,, $
.,,$ %
ToDictionary,,% 1
(,,1 2
),,2 3
),,3 4
;,,4 5
}.. 	
var00 
email00 
=00 
request00 
.00 
Email00 !
.00! "
Trim00" &
(00& '
)00' (
.00( )
ToLowerInvariant00) 9
(009 :
)00: ;
;00; <
var22 
existingUser22 
=22 
await33 
_userRepository33 !
.33! "
GetByEmailAsync33" 1
(331 2
email332 7
)337 8
;338 9
if55 

(55 
existingUser55 
is55 
not55 
null55  $
)55$ %
{66 	
throw77 
new77 
ConflictException77 '
(77' (
$str88 <
)88< =
;88= >
}99 	
var;; 
user;; 
=;; 
new;; 
User;; 
{<< 	
	FirstName== 
=== 
request== 
.==  
	FirstName==  )
.==) *
Trim==* .
(==. /
)==/ 0
,==0 1
LastName>> 
=>> 
request>> 
.>> 
LastName>> '
.>>' (
Trim>>( ,
(>>, -
)>>- .
,>>. /
Email?? 
=?? 
email?? 
,?? 
Role@@ 
=@@ 
UserRole@@ 
.@@ 
User@@  
,@@  !
IsActiveAA 
=AA 
trueAA 
,AA 
	CreatedAtBB 
=BB 
DateTimeBB  
.BB  !
UtcNowBB! '
}CC 	
;CC	 

userEE 
.EE 
PasswordHashEE 
=EE 
_passwordHasherFF 
.FF 
HashPasswordFF (
(FF( )
userFF) -
,FF- .
requestFF/ 6
.FF6 7
PasswordFF7 ?
)FF? @
;FF@ A
varHH 
createdUserHH 
=HH 
awaitII 
_userRepositoryII !
.II! "
AddAsyncII" *
(II* +
userII+ /
)II/ 0
;II0 1
varKK 
tokenIdKK 
=KK 
GuidKK 
.KK 
NewGuidKK "
(KK" #
)KK# $
;KK$ %
varMM 
sessionMM 
=MM 
newMM 
UserSessionMM %
{NN 	
UserIdOO 
=OO 
createdUserOO  
.OO  !
IdOO! #
,OO# $
TokenIdPP 
=PP 
tokenIdPP 
,PP 
	CreatedAtQQ 
=QQ 
DateTimeQQ  
.QQ  !
UtcNowQQ! '
,QQ' (
LastActivityAtRR 
=RR 
DateTimeRR %
.RR% &
UtcNowRR& ,
,RR, -
	IsRevokedSS 
=SS 
falseSS 
}TT 	
;TT	 

varVV 
(VV 
tokenVV 
,VV 
	expiresAtVV 
)VV 
=VV  
_jwtTokenGeneratorWW 
.WW 
GenerateTokenWW ,
(WW, -
createdUserXX 
,XX 
tokenIdYY 
)YY 
;YY 
session[[ 
.[[ 
	ExpiresAt[[ 
=[[ 
	expiresAt[[ %
;[[% &
await]] 
_sessionRepository]]  
.]]  !
AddAsync]]! )
(]]) *
session]]* 1
)]]1 2
;]]2 3
return__ 
CreateAuthResponse__ !
(__! "
createdUser`` 
,`` 
tokenaa 
,aa 
	expiresAtbb 
)bb 
;bb 
}cc 
publicee 

asyncee 
Taskee 
<ee 
AuthResponseee "
>ee" #

LoginAsyncee$ .
(ee. /
LoginRequestff 
requestff 
)ff 
{gg 
varii 
validationResultii 
=ii 
awaitjj 	
_loginValidatorjj
 
.jj 
ValidateAsyncjj '
(jj' (
requestjj( /
)jj/ 0
;jj0 1
ifll 

(ll 
!ll 
validationResultll 
.ll 
IsValidll %
)ll% &
{mm 	
thrownn 
newnn 
Taskifynn 
.nn  
Businessnn  (
.nn( )

Exceptionsnn) 3
.nn3 4
ValidationExceptionnn4 G
(nnG H
validationResultoo $
.oo$ %
ToDictionaryoo% 1
(oo1 2
)oo2 3
)oo3 4
;oo4 5
}qq 	
varss 
emailss 
=ss 
requestss 
.ss 
Emailss !
.ss! "
Trimss" &
(ss& '
)ss' (
.ss( )
ToLowerInvariantss) 9
(ss9 :
)ss: ;
;ss; <
varuu 
useruu 
=uu 
awaitvv 
_userRepositoryvv !
.vv! "
GetByEmailAsyncvv" 1
(vv1 2
emailvv2 7
)vv7 8
;vv8 9
ifxx 

(xx 
userxx 
isxx 
nullxx 
)xx 
{yy 	
throwzz 
newzz #
AuthenticationExceptionzz -
(zz- .
$str{{ ,
){{, -
;{{- .
}|| 	
if~~ 

(~~ 
!~~ 
user~~ 
.~~ 
IsActive~~ 
)~~ 
{ 	
throw
ÄÄ 
new
ÄÄ %
AuthenticationException
ÄÄ -
(
ÄÄ- .
$str
ÅÅ 5
)
ÅÅ5 6
;
ÅÅ6 7
}
ÇÇ 	
var
ÑÑ 
passwordResult
ÑÑ 
=
ÑÑ 
_passwordHasher
ÖÖ 
.
ÖÖ "
VerifyHashedPassword
ÖÖ 0
(
ÖÖ0 1
user
ÜÜ 
,
ÜÜ 
user
áá 
.
áá 
PasswordHash
áá !
,
áá! "
request
àà 
.
àà 
Password
àà  
)
àà  !
;
àà! "
if
ää 

(
ää 
passwordResult
ää 
==
ää (
PasswordVerificationResult
ää 8
.
ää8 9
Failed
ää9 ?
)
ää? @
{
ãã 	
throw
åå 
new
åå %
AuthenticationException
åå 0
(
åå0 1
$str
çç ,
)
çç, -
;
çç- .
}
éé 	
user
êê 
.
êê 
LastLoginAt
êê 
=
êê 
DateTime
êê #
.
êê# $
UtcNow
êê$ *
;
êê* +
await
íí 
_userRepository
íí 
.
íí 
UpdateAsync
íí )
(
íí) *
user
íí* .
)
íí. /
;
íí/ 0
var
îî 
tokenId
îî 
=
îî 
Guid
îî 
.
îî 
NewGuid
îî "
(
îî" #
)
îî# $
;
îî$ %
var
ññ 
(
ññ 
token
ññ 
,
ññ 
	expiresAt
ññ 
)
ññ 
=
ññ   
_jwtTokenGenerator
óó 
.
óó 
GenerateToken
óó ,
(
óó, -
user
òò 
,
òò 
tokenId
ôô 
)
ôô 
;
ôô 
var
õõ 
session
õõ 
=
õõ 
new
õõ 
UserSession
õõ %
{
úú 	
UserId
ùù 
=
ùù 
user
ùù 
.
ùù 
Id
ùù 
,
ùù 
TokenId
ûû 
=
ûû 
tokenId
ûû 
,
ûû 
	CreatedAt
üü 
=
üü 
DateTime
üü  
.
üü  !
UtcNow
üü! '
,
üü' (
	ExpiresAt
†† 
=
†† 
	expiresAt
†† !
,
††! "
LastActivityAt
°° 
=
°° 
DateTime
°° %
.
°°% &
UtcNow
°°& ,
,
°°, -
	IsRevoked
¢¢ 
=
¢¢ 
false
¢¢ 
}
££ 	
;
££	 

await
••  
_sessionRepository
••  
.
••  !
AddAsync
••! )
(
••) *
session
••* 1
)
••1 2
;
••2 3
return
ßß  
CreateAuthResponse
ßß !
(
ßß! "
user
®® 
,
®® 
token
©© 
,
©© 
	expiresAt
™™ 
)
™™ 
;
™™ 
}
´´ 
public
≠≠ 

async
≠≠ 
Task
≠≠ 
LogoutAsync
≠≠ !
(
≠≠! "
Guid
≠≠" &
tokenId
≠≠' .
)
≠≠. /
{
ÆÆ 
var
ØØ 
session
ØØ 
=
ØØ 
await
∞∞  
_sessionRepository
∞∞ $
.
∞∞$ %
GetByTokenIdAsync
∞∞% 6
(
∞∞6 7
tokenId
∞∞7 >
)
∞∞> ?
;
∞∞? @
if
≤≤ 

(
≤≤ 
session
≤≤ 
is
≤≤ 
null
≤≤ 
||
≤≤ 
session
≤≤ &
.
≤≤& '
	IsRevoked
≤≤' 0
)
≤≤0 1
{
≥≥ 	
return
¥¥ 
;
¥¥ 
}
µµ 	
await
∑∑  
_sessionRepository
∑∑  
.
∑∑  !
RevokeAsync
∑∑! ,
(
∑∑, -
session
∑∑- 4
)
∑∑4 5
;
∑∑5 6
}
∏∏ 
private
∫∫ 
static
∫∫ 
AuthResponse
∫∫  
CreateAuthResponse
∫∫  2
(
∫∫2 3
User
ªª 
user
ªª 
,
ªª 
string
ºº 
token
ºº 
,
ºº 
DateTime
ΩΩ 
	expiresAt
ΩΩ 
)
ΩΩ 
{
ææ 
return
øø 
new
øø 
AuthResponse
øø 
{
¿¿ 	
Token
¡¡ 
=
¡¡ 
token
¡¡ 
,
¡¡ 
	ExpiresAt
¬¬ 
=
¬¬ 
	expiresAt
¬¬ !
,
¬¬! "
User
√√ 
=
√√ 
new
√√ 
UserResponse
√√ #
{
ƒƒ 
Id
≈≈ 
=
≈≈ 
user
≈≈ 
.
≈≈ 
Id
≈≈ 
,
≈≈ 
	FirstName
∆∆ 
=
∆∆ 
user
∆∆  
.
∆∆  !
	FirstName
∆∆! *
,
∆∆* +
LastName
«« 
=
«« 
user
«« 
.
««  
LastName
««  (
,
««( )
Email
»» 
=
»» 
user
»» 
.
»» 
Email
»» "
,
»»" #
Role
…… 
=
…… 
user
…… 
.
…… 
Role
……  
.
……  !
ToString
……! )
(
……) *
)
……* +
}
   
}
ÀÀ 	
;
ÀÀ	 

}
ÃÃ 
}ÕÕ ≥	
áC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Interfaces\IUserManagementService.cs
	namespace 	
Taskify
 
. 
Business 
. 

Interfaces %
;% &
public 
	interface "
IUserManagementService '
{ 
Task 
< 	
IReadOnlyList	 
< 
AdminUserResponse (
>( )
>) *
GetAllUsersAsync+ ;
(; <
int 
currentAdminId 
) 
; 
Task

 
ActivateUserAsync

	 
(

 
int 
userId 
, 
int 
currentAdminId 
) 
; 
Task 
DeactivateUserAsync	 
( 
int 
userId 
, 
int 
currentAdminId 
) 
; 
Task 
DeleteUserAsync	 
( 
int 
userId 
, 
int 
currentAdminId 
) 
; 
} ÷:
}C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Interfaces\ITaskService.cs
	namespace 	
Taskify
 
. 
Business 
. 

Interfaces %
;% &
public 
	interface 
ITaskService 
{ 
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ %
GetMyTasksAsync& 5
(5 6
int 
currentUserId 
, 
string 
currentUserRole 
) 
;  
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ %!
GetAssignedTasksAsync& ;
(; <
int 
currentUserId 
, 
string 
currentUserRole 
) 
;  
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ % 
GetPendingTasksAsync& :
(: ;
int 
currentUserId 
, 
string 
currentUserRole 
) 
;  
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ %#
GetInProgressTasksAsync& =
(= >
int 
currentUserId 
, 
string 
currentUserRole 
) 
;  
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ %"
GetCompletedTasksAsync& <
(< =
int 
currentUserId 
, 
string 
currentUserRole 
) 
;  
Task 
< 	
IReadOnlyList	 
< 
TaskResponse #
># $
>$ %"
GetCancelledTasksAsync& <
(< =
int   
currentUserId   
,   
string!! 
currentUserRole!! 
)!! 
;!!  
Task## 
<## 	
IReadOnlyList##	 
<## 
TaskResponse## #
>### $
>##$ % 
GetOverdueTasksAsync##& :
(##: ;
int$$ 
currentUserId$$ 
,$$ 
string%% 
currentUserRole%% 
)%% 
;%%  
Task'' 
<'' 	
TaskResponse''	 
>'' 
GetTaskByIdAsync'' '
(''' (
int(( 
id(( 
,(( 
int)) 
currentUserId)) 
,)) 
string** 
currentUserRole** 
)** 
;**  
Task,, 
<,, 	
TaskResponse,,	 
>,, 
CreateTaskAsync,, &
(,,& '
CreateTaskRequest-- 
request-- !
,--! "
int.. 
currentUserId.. 
,.. 
string// 
currentUserRole// 
)// 
;//  
Task11 
<11 	
TaskResponse11	 
>11 
UpdateTaskAsync11 &
(11& '
int22 
id22 
,22 
UpdateTaskRequest33 
request33 !
,33! "
int44 
currentUserId44 
,44 
string55 
currentUserRole55 
)55 
;55  
Task77 
<77 	
TaskResponse77	 
>77 
ChangeStatusAsync77 (
(77( )
int88 
id88 
,88 #
UpdateTaskStatusRequest99 
request99  '
,99' (
int:: 
currentUserId:: 
,:: 
string;; 
currentUserRole;; 
);; 
;;;  
Task== 
DeleteTaskAsync==	 
(== 
int>> 
id>> 
,>> 
int?? 
currentUserId?? 
,?? 
string@@ 
currentUserRole@@ 
)@@ 
;@@  
TaskFF 
<FF 	"
AdminTaskPagedResponseFF	 
>FF  
GetAdminTasksAsyncFF! 3
(FF3 4
intGG 

pageNumberGG 
,GG 
intHH 
pageSizeHH 
,HH 
intII 
adminUserIdII 
,II 
stringJJ 
currentUserRoleJJ 
)JJ 
;JJ  
TaskLL 
<LL 	'
AdminTaskStatisticsResponseLL	 $
>LL$ %'
GetAdminTaskStatisticsAsyncLL& A
(LLA B
intMM 
adminUserIdMM 
,MM 
stringNN 
currentUserRoleNN 
)NN 
;NN  
TaskPP 
<PP 	
TaskResponsePP	 
>PP !
GetAdminTaskByIdAsyncPP ,
(PP, -
intQQ 
idQQ 
,QQ 
intRR 
adminUserIdRR 
,RR 
stringSS 
currentUserRoleSS 
)SS 
;SS  
TaskUU 
<UU 	
TaskResponseUU	 
>UU  
CreateAdminTaskAsyncUU +
(UU+ ,
CreateTaskRequestVV 
requestVV !
,VV! "
intWW 
adminUserIdWW 
,WW 
stringXX 
currentUserRoleXX 
)XX 
;XX  
TaskZZ 
<ZZ 	
TaskResponseZZ	 
>ZZ  
UpdateAdminTaskAsyncZZ +
(ZZ+ ,
int[[ 
id[[ 
,[[ 
UpdateTaskRequest\\ 
request\\ !
,\\! "
int]] 
adminUserId]] 
,]] 
string^^ 
currentUserRole^^ 
)^^ 
;^^  
Task`` 
<`` 	
TaskResponse``	 
>`` &
ChangeAdminTaskStatusAsync`` 1
(``1 2
intaa 
idaa 
,aa #
UpdateTaskStatusRequestbb 
requestbb  '
,bb' (
intcc 
adminUserIdcc 
,cc 
stringdd 
currentUserRoledd 
)dd 
;dd  
Taskff 
<ff 	
TaskResponseff	 
>ff '
ChangeAdminTaskDueDateAsyncff 2
(ff2 3
intgg 
idgg 
,gg $
UpdateTaskDueDateRequesthh  
requesthh! (
,hh( )
intii 
adminUserIdii 
,ii 
stringjj 
currentUserRolejj 
)jj 
;jj  
Taskll 
<ll 	
TaskResponsell	 
>ll (
ChangeAdminTaskPriorityAsyncll 3
(ll3 4
intmm 
idmm 
,mm %
UpdateTaskPriorityRequestnn !
requestnn" )
,nn) *
intoo 
adminUserIdoo 
,oo 
stringpp 
currentUserRolepp 
)pp 
;pp  
Taskrr  
DeleteAdminTaskAsyncrr	 
(rr 
intss 
idss 
,ss 
inttt 
adminUserIdtt 
,tt 
stringuu 
currentUserRoleuu 
)uu 
;uu  
Task{{ 
<{{ 	
IReadOnlyList{{	 
<{{ 
UserAssignmentDto{{ (
>{{( )
>{{) *&
GetUsersForAssignmentAsync{{+ E
({{E F
){{F G
;{{G H
}|| »	
ÄC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Interfaces\IProfileService.cs
	namespace 	
Taskify
 
. 
Business 
. 

Interfaces %
;% &
public 
	interface 
IProfileService  
{ 
Task 
< 	
ProfileResponse	 
> 
GetProfileAsync )
() *
int* -
userId. 4
)4 5
;5 6
Task		 
UpdateFullNameAsync			 
(		 
int

 
userId

 
,

 !
UpdateFullNameRequest 
request %
)% &
;& '
Task 
ChangePasswordAsync	 
( 
int 
userId 
, !
ChangePasswordRequest 
request %
)% &
;& '
Task "
DeactivateAccountAsync	 
(  
int  #
userId$ *
)* +
;+ ,
Task 
DeleteAccountAsync	 
( 
int 
userId  &
)& '
;' (
} ë
ÉC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Interfaces\IJwtTokenGenerator.cs
	namespace 	
Taskify
 
. 
Business 
. 

Interfaces %
;% &
public 
	interface 
IJwtTokenGenerator #
{ 
( 
string 
Token 
, 
DateTime 
	ExpiresAt %
)% &
GenerateToken' 4
(4 5
User 
user 
, 
Guid		 
tokenId		 
)		 
;		 
}

 ‚
}C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Interfaces\IAuthService.cs
	namespace 	
Taskify
 
. 
Business 
. 

Interfaces %
;% &
public 
	interface 
IAuthService 
{ 
Task 
< 	
AuthResponse	 
> 
RegisterAsync $
($ %
RegisterRequest% 4
request5 <
)< =
;= >
Task		 
<		 	
AuthResponse			 
>		 

LoginAsync		 !
(		! "
LoginRequest		" .
request		/ 6
)		6 7
;		7 8
Task 
LogoutAsync	 
( 
Guid 
tokenId !
)! "
;" #
} ¨
ÑC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Exceptions\ValidationException.cs
	namespace 	
Taskify
 
. 
Business 
. 

Exceptions %
;% &
public 
class 
ValidationException  
:! "
	Exception# ,
{ 
public 

IDictionary 
< 
string 
, 
string %
[% &
]& '
>' (
Errors) /
{0 1
get2 5
;5 6
}7 8
public 

ValidationException 
( 
IDictionary 
< 
string 
, 
string "
[" #
]# $
>$ %
errors& ,
), -
:		 	
base		
 
(		 
$str		 8
)		8 9
{

 
Errors 
= 
errors 
; 
} 
} ˙
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Exceptions\NotFoundException.cs
	namespace 	
Taskify
 
. 
Business 
. 

Exceptions %
;% &
public 
class 
NotFoundException 
:  
	Exception! *
{ 
public 

NotFoundException 
( 
string #
message$ +
)+ ,
: 	
base
 
( 
message 
) 
{ 
} 
}		 ˙
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Exceptions\ConflictException.cs
	namespace 	
Taskify
 
. 
Business 
. 

Exceptions %
;% &
public 
class 
ConflictException 
:  
	Exception! *
{ 
public 

ConflictException 
( 
string #
message$ +
)+ ,
: 	
base
 
( 
message 
) 
{ 
} 
}		 â
áC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Exceptions\AuthorizationException.cs
	namespace 	
Taskify
 
. 
Business 
. 

Exceptions %
;% &
public 
class "
AuthorizationException #
:$ %
	Exception& /
{ 
public 
"
AuthorizationException !
(! "
string" (
message) 0
)0 1
: 	
base
 
( 
message 
) 
{ 
} 
}		 å
àC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Exceptions\AuthenticationException.cs
	namespace 	
Taskify
 
. 
Business 
. 

Exceptions %
;% &
public 
class #
AuthenticationException $
:% &
	Exception' 0
{ 
public 
#
AuthenticationException "
(" #
string# )
message* 1
)1 2
: 	
base
 
( 
message 
) 
{ 
} 
}		 ‘
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Users\AdminUserResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Users  %
;% &
public 
class 
AdminUserResponse 
{ 
public 

int 
Id 
{ 
get 
; 
set 
; 
} 
public 

string 
	FirstName 
{ 
get !
;! "
set# &
;& '
}( )
=* +
string, 2
.2 3
Empty3 8
;8 9
public		 

string		 
LastName		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
=		) *
string		+ 1
.		1 2
Empty		2 7
;		7 8
public 

string 
Email 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
Role 
{ 
get 
; 
set !
;! "
}# $
=% &
string' -
.- .
Empty. 3
;3 4
public 

bool 
IsActive 
{ 
get 
; 
set  #
;# $
}% &
public 

int 
	TaskCount 
{ 
get 
; 
set  #
;# $
}% &
public 

DateTime 
	CreatedAt 
{ 
get  #
;# $
set% (
;( )
}* +
public 

DateTime 
? 
LastLoginAt  
{! "
get# &
;& '
set( +
;+ ,
}- .
} Ù
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\UserAssignmentDto.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class 
UserAssignmentDto 
{ 
public 

int 
Id 
{ 
get 
; 
set 
; 
} 
public 

string 
FullName 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
public 

string 
Email 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
} ß
àC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\UpdateTaskStatusRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class #
UpdateTaskStatusRequest $
{ 
public 

int 
Status 
{ 
get 
; 
set  
;  !
}" #
} Ñ
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\UpdateTaskRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class 
UpdateTaskRequest 
{ 
public 

string 
Title 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
? 
Description 
{  
get! $
;$ %
set& )
;) *
}+ ,
public		 

string		 
Category		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
=		) *
string		+ 1
.		1 2
Empty		2 7
;		7 8
public 

int 
Priority 
{ 
get 
; 
set "
;" #
}$ %
public 

DateTime 
? 
DueDate 
{ 
get "
;" #
set$ '
;' (
}) *
public 

int 
? 
AssignedToUserId  
{! "
get# &
;& '
set( +
;+ ,
}- .
} ≠
äC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\UpdateTaskPriorityRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class %
UpdateTaskPriorityRequest &
{ 
public 

int 
Priority 
{ 
get 
; 
set "
;" #
}$ %
} æ
âC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\UpdateTaskDueDateRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class $
UpdateTaskDueDateRequest %
{ 
public 

DateTime 
? 
DueDate 
{ 
get "
;" #
set$ '
;' (
}) *
} ‰
}C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\TaskResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class 
TaskResponse 
{ 
public 

int 
Id 
{ 
get 
; 
set 
; 
} 
public 

string 
Title 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public		 

string		 
?		 
Description		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
public 

string 
Category 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
public 

string 
Priority 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
public 

string 
Status 
{ 
get 
; 
set  #
;# $
}% &
=' (
string) /
./ 0
Empty0 5
;5 6
public 

DateTime 
? 
DueDate 
{ 
get "
;" #
set$ '
;' (
}) *
public 

DateTime 
	CreatedAt 
{ 
get  #
;# $
set% (
;( )
}* +
public 

DateTime 
? 
	UpdatedAt 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 

int 
CreatedByUserId 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 

string 
CreatedByName 
{  !
get" %
;% &
set' *
;* +
}, -
=. /
string0 6
.6 7
Empty7 <
;< =
public 

int 
? 
AssignedToUserId  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 

string 
? 
AssignedToName !
{" #
get$ '
;' (
set) ,
;, -
}. /
} Ñ
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\CreateTaskRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class 
CreateTaskRequest 
{ 
public 

string 
Title 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
? 
Description 
{  
get! $
;$ %
set& )
;) *
}+ ,
public

 

string

 
Category

 
{

 
get

  
;

  !
set

" %
;

% &
}

' (
=

) *
string

+ 1
.

1 2
Empty

2 7
;

7 8
public 

int 
Priority 
{ 
get 
; 
set "
;" #
}$ %
public 

DateTime 
? 
DueDate 
{ 
get "
;" #
set$ '
;' (
}) *
public 

int 
? 
AssignedToUserId  
{! "
get# &
;& '
set( +
;+ ,
}- .
} ó	
åC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\AdminTaskStatisticsResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class '
AdminTaskStatisticsResponse (
{ 
public 

int 
Pending 
{ 
get 
; 
set !
;! "
}# $
public 

int 

InProgress 
{ 
get 
;  
set! $
;$ %
}& '
public		 

int		 
	Completed		 
{		 
get		 
;		 
set		  #
;		# $
}		% &
public 

int 
	Cancelled 
{ 
get 
; 
set  #
;# $
}% &
public 

int 
Overdue 
{ 
get 
; 
set !
;! "
}# $
} ∑
áC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Tasks\AdminTaskPagedResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Tasks  %
;% &
public 
class "
AdminTaskPagedResponse #
{ 
public 

IReadOnlyList 
< 
TaskResponse %
>% &
Items' ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
= 	
Array
 
. 
Empty 
< 
TaskResponse "
>" #
(# $
)$ %
;% &
public 

int 

PageNumber 
{ 
get 
;  
set! $
;$ %
}& '
public

 

int

 
PageSize

 
{

 
get

 
;

 
set

 "
;

" #
}

$ %
public 

int 

TotalCount 
{ 
get 
;  
set! $
;$ %
}& '
public 

int 

TotalPages 
{ 
get 
;  
set! $
;$ %
}& '
public 

bool 
HasPreviousPage 
{  !
get" %
;% &
set' *
;* +
}, -
public 

bool 
HasNextPage 
{ 
get !
;! "
set# &
;& '
}( )
} Ä
àC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Profile\UpdateFullNameRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Profile  '
;' (
public 
class !
UpdateFullNameRequest "
{ 
public 

string 
FullName 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
} é
ÇC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Profile\ProfileResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Profile  '
;' (
public 
class 
ProfileResponse 
{ 
public 

int 
Id 
{ 
get 
; 
set 
; 
} 
public 

string 
UserId 
{ 
get 
; 
set  #
;# $
}% &
=' (
string) /
./ 0
Empty0 5
;5 6
public		 

string		 
FullName		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
=		) *
string		+ 1
.		1 2
Empty		2 7
;		7 8
public 

string 
Email 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
Role 
{ 
get 
; 
set !
;! "
}# $
=% &
string' -
.- .
Empty. 3
;3 4
public 

DateTime 
AccountCreatedOn $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 

bool 
IsActive 
{ 
get 
; 
set  #
;# $
}% &
} ˙
àC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Profile\ChangePasswordRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Profile  '
;' (
public 
class !
ChangePasswordRequest "
{ 
public 

string 
CurrentPassword !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
string2 8
.8 9
Empty9 >
;> ?
public 

string 
NewPassword 
{ 
get  #
;# $
set% (
;( )
}* +
=, -
string. 4
.4 5
Empty5 :
;: ;
} ƒ
|C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Auth\UserResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Auth  $
;$ %
public 
class 
UserResponse 
{ 
public 

int 
Id 
{ 
get 
; 
set 
; 
} 
public 

string 
	FirstName 
{ 
get !
;! "
set# &
;& '
}( )
=* +
string, 2
.2 3
Empty3 8
;8 9
public		 

string		 
LastName		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
=		) *
string		+ 1
.		1 2
Empty		2 7
;		7 8
public 

string 
Email 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
Role 
{ 
get 
; 
set !
;! "
}# $
=% &
string' -
.- .
Empty. 3
;3 4
} ≤
C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Auth\RegisterRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Auth  $
;$ %
public 
class 
RegisterRequest 
{ 
public 

string 
	FirstName 
{ 
get !
;! "
set# &
;& '
}( )
=* +
string, 2
.2 3
Empty3 8
;8 9
public 

string 
LastName 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
public		 

string		 
Email		 
{		 
get		 
;		 
set		 "
;		" #
}		$ %
=		& '
string		( .
.		. /
Empty		/ 4
;		4 5
public 

string 
Password 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
public 

string 
ConfirmPassword !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
string2 8
.8 9
Empty9 >
;> ?
} ‘
|C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Auth\LoginRequest.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Auth  $
;$ %
public 
class 
LoginRequest 
{ 
public 

string 
Email 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

string 
Password 
{ 
get  
;  !
set" %
;% &
}' (
=) *
string+ 1
.1 2
Empty2 7
;7 8
} Ó
|C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\DTOs\Auth\AuthResponse.cs
	namespace 	
Taskify
 
. 
Business 
. 
DTOs 
.  
Auth  $
;$ %
public 
class 
AuthResponse 
{ 
public 

string 
Token 
{ 
get 
; 
set "
;" #
}$ %
=& '
string( .
.. /
Empty/ 4
;4 5
public 

DateTime 
	ExpiresAt 
{ 
get  #
;# $
set% (
;( )
}* +
public		 

UserResponse		 
User		 
{		 
get		 "
;		" #
set		$ '
;		' (
}		) *
=		+ ,
new		- 0
(		0 1
)		1 2
;		2 3
}

 “	
C:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Configuration\JwtSettings.cs
	namespace 	
Taskify
 
. 
Business 
. 
Configuration (
;( )
public 
class 
JwtSettings 
{ 
public 

string 
	SecretKey 
{ 
get !
;! "
set# &
;& '
}( )
=* +
string, 2
.2 3
Empty3 8
;8 9
public 

string 
Issuer 
{ 
get 
; 
set  #
;# $
}% &
=' (
string) /
./ 0
Empty0 5
;5 6
public		 

string		 
Audience		 
{		 
get		  
;		  !
set		" %
;		% &
}		' (
=		) *
string		+ 1
.		1 2
Empty		2 7
;		7 8
public 

int 
ExpirationMinutes  
{! "
get# &
;& '
set( +
;+ ,
}- .
} ü
lC:\Faizzalz\Internship\10Pearls Shine Intern\cohort-9-dotnet-14421-faizal\backend\Taskify.Business\Class1.cs
	namespace 	
Taskify
 
. 
Business 
; 
public 
class 
Class1 
{ 
} 