using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCFL.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchemaAndSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    pkRoleId = table.Column<string>(type: "TEXT", nullable: false),
                    roleName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.pkRoleId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    pkUserId = table.Column<string>(type: "TEXT", nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    parentConsentRequired = table.Column<bool>(type: "INTEGER", nullable: false),
                    parentConsentReceived = table.Column<bool>(type: "INTEGER", nullable: false),
                    onboardingCompleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    mustChangePassword = table.Column<bool>(type: "INTEGER", nullable: false),
                    FullName = table.Column<string>(type: "TEXT", nullable: true),
                    userName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.pkUserId);
                });

            migrationBuilder.CreateTable(
                name: "CashInCategory",
                columns: table => new
                {
                    pkCashInCategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    categoryName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    sortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CashInCategory", x => x.pkCashInCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "CashOutCategory",
                columns: table => new
                {
                    pkCashOutCategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    categoryName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    sortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CashOutCategory", x => x.pkCashOutCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "LearningTopic",
                columns: table => new
                {
                    pkLearningTopicId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    topicName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    sortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningTopic", x => x.pkLearningTopicId);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationAllowList",
                columns: table => new
                {
                    pkRegistrationAllowListId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationAllowList", x => x.pkRegistrationAllowListId);
                });

            migrationBuilder.CreateTable(
                name: "Scenario",
                columns: table => new
                {
                    pkScenarioId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenario", x => x.pkScenarioId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "pkRoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false),
                    fkRoleId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.fkUserId, x.fkRoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_fkRoleId",
                        column: x => x.fkRoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "pkRoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LearningSavingsGoal",
                columns: table => new
                {
                    pkLearningSavingsGoalId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    goalTitle = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    targetAmount = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    currentSavedAmount = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: true),
                    targetDate = table.Column<DateOnly>(type: "date", nullable: true),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningSavingsGoal", x => x.pkLearningSavingsGoalId);
                    table.CheckConstraint("CK_SavingsGoal_Amounts", "targetAmount >= 0 AND currentSavedAmount >= 0");
                    table.ForeignKey(
                        name: "FK_LearningSavingsGoal_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoneyFeelingSubmission",
                columns: table => new
                {
                    pkMoneyFeelingSubmissionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    feeling = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    submittedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoneyFeelingSubmission", x => x.pkMoneyFeelingSubmissionId);
                    table.ForeignKey(
                        name: "FK_MoneyFeelingSubmission_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParentAccessLink",
                columns: table => new
                {
                    pkParentAccessLinkId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    token = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    expiresAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParentAccessLink", x => x.pkParentAccessLinkId);
                    table.ForeignKey(
                        name: "FK_ParentAccessLink_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParentConsent",
                columns: table => new
                {
                    pkParentConsentId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    parentName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    parentEmail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    consentGiven = table.Column<bool>(type: "INTEGER", nullable: false),
                    consentGivenAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParentConsent", x => x.pkParentConsentId);
                    table.CheckConstraint("CK_ParentConsent_ConsentGivenAt", "(consentGiven = 0 AND consentGivenAt IS NULL) OR (consentGiven = 1 AND consentGivenAt IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_ParentConsent_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFeedback",
                columns: table => new
                {
                    pkUserFeedbackId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    feedbackType = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    comment = table.Column<string>(type: "TEXT", nullable: false),
                    submittedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFeedback", x => x.pkUserFeedbackId);
                    table.ForeignKey(
                        name: "FK_UserFeedback_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserGameStat",
                columns: table => new
                {
                    pkUserGameStatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    currentGameMoney = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    currentConfidenceScore = table.Column<int>(type: "INTEGER", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameStat", x => x.pkUserGameStatId);
                    table.CheckConstraint("CK_UserGameStat_CurrentGameMoney", "currentGameMoney >= 0");
                    table.ForeignKey(
                        name: "FK_UserGameStat_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfile",
                columns: table => new
                {
                    pkUserProfileId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    fullName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    nickName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    dateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    hasBankAccount = table.Column<bool>(type: "INTEGER", nullable: false),
                    earnsMoneyAnswer = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    hasSavingsAnswer = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    paysBillsAnswer = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    spendsOnWantsAnswer = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    learningComments = table.Column<string>(type: "TEXT", nullable: true),
                    parentTeachingsAnswer = table.Column<string>(type: "TEXT", nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfile", x => x.pkUserProfileId);
                    table.ForeignKey(
                        name: "FK_UserProfile_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoneyEntry",
                columns: table => new
                {
                    pkMoneyEntryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    entryType = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    amount = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    comment = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false),
                    fkCashInCategoryId = table.Column<int>(type: "INTEGER", nullable: true),
                    fkCashOutCategoryId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoneyEntry", x => x.pkMoneyEntryId);
                    table.CheckConstraint("CK_MoneyEntry_CategoryChoice", "(entryType = 'CashIn' AND fkCashInCategoryId IS NOT NULL AND fkCashOutCategoryId IS NULL) OR (entryType = 'CashOut' AND fkCashOutCategoryId IS NOT NULL AND fkCashInCategoryId IS NULL)");
                    table.CheckConstraint("CK_MoneyEntry_EntryType", "entryType IN ('CashIn', 'CashOut')");
                    table.ForeignKey(
                        name: "FK_MoneyEntry_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MoneyEntry_CashInCategory_fkCashInCategoryId",
                        column: x => x.fkCashInCategoryId,
                        principalTable: "CashInCategory",
                        principalColumn: "pkCashInCategoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MoneyEntry_CashOutCategory_fkCashOutCategoryId",
                        column: x => x.fkCashOutCategoryId,
                        principalTable: "CashOutCategory",
                        principalColumn: "pkCashOutCategoryId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ScenarioChoice",
                columns: table => new
                {
                    pkScenarioChoiceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    optionText = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    resultText = table.Column<string>(type: "TEXT", nullable: false),
                    lessonText = table.Column<string>(type: "TEXT", nullable: false),
                    moneyImpact = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    confidenceImpact = table.Column<int>(type: "INTEGER", nullable: false),
                    sortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    isActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    fkScenarioId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScenarioChoice", x => x.pkScenarioChoiceId);
                    table.ForeignKey(
                        name: "FK_ScenarioChoice_Scenario_fkScenarioId",
                        column: x => x.fkScenarioId,
                        principalTable: "Scenario",
                        principalColumn: "pkScenarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParentFeedback",
                columns: table => new
                {
                    pkParentFeedbackId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    parentEmail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    parentName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    moneyStory = table.Column<string>(type: "TEXT", nullable: false),
                    whatChildShouldLearn = table.Column<string>(type: "TEXT", nullable: false),
                    submittedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkParentAccessLinkId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParentFeedback", x => x.pkParentFeedbackId);
                    table.ForeignKey(
                        name: "FK_ParentFeedback_ParentAccessLink_fkParentAccessLinkId",
                        column: x => x.fkParentAccessLinkId,
                        principalTable: "ParentAccessLink",
                        principalColumn: "pkParentAccessLinkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLearningPreference",
                columns: table => new
                {
                    pkUserLearningPreferenceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    fkUserProfileId = table.Column<int>(type: "INTEGER", nullable: false),
                    fkLearningTopicId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLearningPreference", x => x.pkUserLearningPreferenceId);
                    table.ForeignKey(
                        name: "FK_UserLearningPreference_LearningTopic_fkLearningTopicId",
                        column: x => x.fkLearningTopicId,
                        principalTable: "LearningTopic",
                        principalColumn: "pkLearningTopicId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserLearningPreference_UserProfile_fkUserProfileId",
                        column: x => x.fkUserProfileId,
                        principalTable: "UserProfile",
                        principalColumn: "pkUserProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScenarioPlay",
                columns: table => new
                {
                    pkScenarioPlayId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    playedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    gameMoneyBefore = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    gameMoneyAfter = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    confidenceBefore = table.Column<int>(type: "INTEGER", nullable: false),
                    confidenceAfter = table.Column<int>(type: "INTEGER", nullable: false),
                    lessonTextSnapshot = table.Column<string>(type: "TEXT", nullable: false),
                    moneyImpactSnapshot = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: false),
                    confidenceImpactSnapshot = table.Column<int>(type: "INTEGER", nullable: false),
                    fkUserId = table.Column<string>(type: "TEXT", nullable: false),
                    fkScenarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    fkScenarioChoiceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScenarioPlay", x => x.pkScenarioPlayId);
                    table.CheckConstraint("CK_ScenarioPlay_GameMoney", "gameMoneyBefore >= 0 AND gameMoneyAfter >= 0");
                    table.ForeignKey(
                        name: "FK_ScenarioPlay_AspNetUsers_fkUserId",
                        column: x => x.fkUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "pkUserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScenarioPlay_ScenarioChoice_fkScenarioChoiceId",
                        column: x => x.fkScenarioChoiceId,
                        principalTable: "ScenarioChoice",
                        principalColumn: "pkScenarioChoiceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScenarioPlay_Scenario_fkScenarioId",
                        column: x => x.fkScenarioId,
                        principalTable: "Scenario",
                        principalColumn: "pkScenarioId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_fkRoleId",
                table: "AspNetUserRoles",
                column: "fkRoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CashInCategory_categoryName",
                table: "CashInCategory",
                column: "categoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CashOutCategory_categoryName",
                table: "CashOutCategory",
                column: "categoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LearningSavingsGoal_fkUserId",
                table: "LearningSavingsGoal",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LearningTopic_topicName",
                table: "LearningTopic",
                column: "topicName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MoneyEntry_fkCashInCategoryId",
                table: "MoneyEntry",
                column: "fkCashInCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyEntry_fkCashOutCategoryId",
                table: "MoneyEntry",
                column: "fkCashOutCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyEntry_fkUserId",
                table: "MoneyEntry",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyFeelingSubmission_fkUserId",
                table: "MoneyFeelingSubmission",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ParentAccessLink_fkUserId",
                table: "ParentAccessLink",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ParentAccessLink_token",
                table: "ParentAccessLink",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParentConsent_fkUserId",
                table: "ParentConsent",
                column: "fkUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParentFeedback_fkParentAccessLinkId",
                table: "ParentFeedback",
                column: "fkParentAccessLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationAllowList_email",
                table: "RegistrationAllowList",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioChoice_fkScenarioId",
                table: "ScenarioChoice",
                column: "fkScenarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioPlay_fkScenarioChoiceId",
                table: "ScenarioPlay",
                column: "fkScenarioChoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioPlay_fkScenarioId",
                table: "ScenarioPlay",
                column: "fkScenarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioPlay_fkUserId",
                table: "ScenarioPlay",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedback_fkUserId",
                table: "UserFeedback",
                column: "fkUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameStat_fkUserId",
                table: "UserGameStat",
                column: "fkUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserLearningPreference_fkLearningTopicId",
                table: "UserLearningPreference",
                column: "fkLearningTopicId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLearningPreference_fkUserProfileId_fkLearningTopicId",
                table: "UserLearningPreference",
                columns: new[] { "fkUserProfileId", "fkLearningTopicId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_fkUserId",
                table: "UserProfile",
                column: "fkUserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "LearningSavingsGoal");

            migrationBuilder.DropTable(
                name: "MoneyEntry");

            migrationBuilder.DropTable(
                name: "MoneyFeelingSubmission");

            migrationBuilder.DropTable(
                name: "ParentConsent");

            migrationBuilder.DropTable(
                name: "ParentFeedback");

            migrationBuilder.DropTable(
                name: "RegistrationAllowList");

            migrationBuilder.DropTable(
                name: "ScenarioPlay");

            migrationBuilder.DropTable(
                name: "UserFeedback");

            migrationBuilder.DropTable(
                name: "UserGameStat");

            migrationBuilder.DropTable(
                name: "UserLearningPreference");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "CashInCategory");

            migrationBuilder.DropTable(
                name: "CashOutCategory");

            migrationBuilder.DropTable(
                name: "ParentAccessLink");

            migrationBuilder.DropTable(
                name: "ScenarioChoice");

            migrationBuilder.DropTable(
                name: "LearningTopic");

            migrationBuilder.DropTable(
                name: "UserProfile");

            migrationBuilder.DropTable(
                name: "Scenario");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
